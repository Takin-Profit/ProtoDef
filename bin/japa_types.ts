import '@japa/runner'

declare module '@japa/runner' {
  interface TestContext {
    // notify TypeScript about custom context properties
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Test<TestData> {
    // notify TypeScript about custom test properties
  }
}
