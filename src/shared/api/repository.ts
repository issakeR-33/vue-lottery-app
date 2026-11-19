// Узагальнені контракти репозиторію. Кожен описує одну можливість,
// тому сервіс реалізує лише ті, які йому потрібні.

export interface PageParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface Page<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface Readable<T> {
  getAll(params?: PageParams): Promise<Page<T>>
  getById(id: number): Promise<T>
}

export interface Searchable<T> {
  search(query: string, params?: PageParams): Promise<Page<T>>
}

export interface Creatable<T, TCreate = Omit<T, 'id'>> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate = Partial<T>> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable<T> {
  delete(id: number): Promise<T>
}
