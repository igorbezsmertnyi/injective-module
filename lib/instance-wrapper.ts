import { Injector } from './injector'
import { MODULE_METADATA as metadataConstants } from './constants'

export abstract class InstanceWrapper<
  Instances = any,
  Imports = any,
  Exports = any
> {
  public imports: Imports
  public exports: Exports
  public instances: Instances

  constructor(...instances) {
    this.resolveImports()
    this.resolveExports()
    this.resolveInstances(instances)
    this.onInit()
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onInit(): void {}

  private resolveInstances(instances: any[]) {
    this.instances = instances.reduce((acc, value) => {
      const instanceKey = this.decapitalize(value.constructor.name)
      acc[instanceKey] = value
      return acc
    }, {}) as Instances
  }

  private resolveImports() {
    const tokens =
      Reflect.getMetadata(metadataConstants.IMPORTS, this.constructor) ?? []
    this.imports = this.serializeMeatadata<Imports>(tokens)
  }

  private resolveExports() {
    const tokens =
      Reflect.getMetadata(metadataConstants.EXPORTS, this.constructor) ?? []
    this.exports = this.serializeMeatadata<Exports>(tokens)
  }

  private serializeMeatadata<Type>(tokens: any[]) {
    return tokens.reduce((acc, value) => {
      const instanceKey = this.decapitalize(value.name)
      acc[instanceKey] = Injector.resolve(value)
      return acc
    }, {}) as Type
  }

  private decapitalize(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1)
  }
}
