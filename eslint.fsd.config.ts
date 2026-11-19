import type { Linter } from 'eslint'
import boundaries from 'eslint-plugin-boundaries'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// Правила Feature-Sliced Design для eslint-plugin-boundaries:
// 1) шар може імпортувати лише з шарів, що лежать нижче;
// 2) слайси одного шару не імпортують один одного;
// 3) у слайс заходимо лише через його Public API (index.ts).
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] as const

type Layer = (typeof LAYERS)[number]

function below(layer: Layer): Layer[] {
  return LAYERS.slice(LAYERS.indexOf(layer) + 1)
}

// імпорт іншого слайсу чи сегмента shared дозволено лише через index.ts
function publicApi(layers: Layer[]) {
  return { to: { element: { type: layers, fileInternalPath: ['index.ts'] } } }
}

export const fsdBoundaries: Linter.Config[] = [
  {
    name: 'fsd/boundaries',
    files: ['src/**/*.{ts,vue}'],
    ignores: ['src/**/__tests__/**'],
    plugins: { boundaries },
    settings: {
      // alias @ -> src береться з tsconfig, щоб лінтер розумів імпорти '@/entities/user'
      'import/resolver': { typescript: { project: './tsconfig.app.json' } },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'pages', pattern: 'src/pages/*', capture: ['slice'] },
        { type: 'widgets', pattern: 'src/widgets/*', capture: ['slice'] },
        { type: 'features', pattern: 'src/features/*', capture: ['slice'] },
        { type: 'entities', pattern: 'src/entities/*', capture: ['slice'] },
        { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
      ],
    },
    rules: {
      // файл поза шарами FSD теж помилка: весь код має належати якомусь шару
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message:
            'FSD: {{ from.element.type }} не може імпортувати {{ to.element.type }} ' +
            '({{ to.element.fileInternalPath }}). Дозволено лише нижчі шари через index.ts',
          policies: [
            // усередині свого слайсу можна імпортувати будь-що
            { allow: { dependency: { relationship: { to: 'internal' } } } },
            // app збирає застосунок, тому бачить усі шари
            { from: { element: { type: 'app' } }, allow: publicApi(below('app')) },
            { from: { element: { type: 'pages' } }, allow: publicApi(below('pages')) },
            { from: { element: { type: 'widgets' } }, allow: publicApi(below('widgets')) },
            { from: { element: { type: 'features' } }, allow: publicApi(below('features')) },
            { from: { element: { type: 'entities' } }, allow: publicApi(below('entities')) },
            // shared не ділиться на слайси, його сегменти (api, ui, lib, config) можуть
            // спиратися один на одного
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared' } } },
            },
          ],
        },
      ],
    },
  },
]

// окремий конфіг для npm run lint:fsd: лише парсери Vue/TS і правила FSD
export default defineConfigWithVueTs(
  ...pluginVue.configs['flat/base'],
  vueTsConfigs.base,
  ...fsdBoundaries,
)
