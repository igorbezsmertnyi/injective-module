export class InvalidModuleConfig extends Error {
  public type = 'INVALID_MODULE_CONFIG_MESSAGE'

  constructor(public property: string) {
    super()
    this.message = `Invalid property '${property}' passed into the @Module() decorator.`
  }
}
