/** Storage port used by persistence adapters. Tests can inject in-memory doubles. */
export type KeyValueStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function createMemoryStorage(
  initial: Record<string, string> = {},
): KeyValueStorage {
  const data = new Map<string, string>(Object.entries(initial))
  return {
    getItem(key) {
      return data.has(key) ? (data.get(key) ?? null) : null
    },
    setItem(key, value) {
      data.set(key, value)
    },
    removeItem(key) {
      data.delete(key)
    },
  }
}

export function createLocalStorageAdapter(
  storage: KeyValueStorage = globalThis.localStorage,
): KeyValueStorage {
  return storage
}
