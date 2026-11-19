// jsdom не реалізує matchMedia, а PrimeVue (DataTable, Paginator) використовує його
// для адаптивних режимів. Заглушка завжди відповідає "медіазапит не збігся".
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
