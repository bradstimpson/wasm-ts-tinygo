declare module NodeJS {
  interface Global {
    __wasm__: WasmAPI;
    Go: any;
  }
}
