type Factory<T> = () => T

// Універсальний реєстр сервісів. Шар shared не знає про конкретні сервіси з entities:
// їх реєструє шар app (app/providers/services.ts), а клієнтський код отримує сервіс за ключем
// і залежить лише від інтерфейсу, тому реалізацію легко підмінити (наприклад, у тестах).
export class ServiceProvider {
  private static factories = new Map<string, Factory<unknown>>()
  private static instances = new Map<string, unknown>()

  static register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory)
    // повторна реєстрація замінює вже створений екземпляр
    this.instances.delete(key)
  }

  static get<T>(key: string): T {
    if (!this.instances.has(key)) {
      const factory = this.factories.get(key)
      if (!factory) throw new Error(`Service "${key}" is not registered`)
      this.instances.set(key, factory())
    }
    return this.instances.get(key) as T
  }

  static reset(): void {
    this.factories.clear()
    this.instances.clear()
  }
}
