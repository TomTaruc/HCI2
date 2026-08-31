import '@testing-library/jest-dom';

// Simple mock for localStorage in vitest (when not using jsdom)
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value.toString();
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const key in store) {
      delete store[key];
    }
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (index: number) => Object.keys(store)[index] || null,
};

// Also we need to proxy Object.keys(localStorage)
globalThis.localStorage = new Proxy(localStorageMock as any, {
  ownKeys() {
    return Object.keys(store);
  },
  getOwnPropertyDescriptor(target, prop) {
    if (Object.prototype.hasOwnProperty.call(store, prop)) {
      return {
        enumerable: true,
        configurable: true,
        value: store[prop as string],
      };
    }
    return Reflect.getOwnPropertyDescriptor(target, prop);
  }
});
