import 'reflect-metadata'
import { InstanceWrapper } from './instance-wrapper'
import { MODULE_METADATA as metadataConstants } from './constants'

export class Injector {
  private depInstances: Map<string, any> = new Map<string, any>()

  static resolve<T>(target: any): T {
    const keys = Reflect.getOwnMetadataKeys(target)
    const tokens =
      keys.map((key) => Reflect.getMetadata(key, target)).flat() || []
    const injections = tokens.map((token: any) => Injector.resolve<any>(token))
    return new target(...injections)
  }

  resolve<T = InstanceType<any>>(target: any): InstanceWrapper<T> {
    if (this.depInstances && this.depInstances.has(target.name)) {
      return this.depInstances.get(target.name)
    }

    const keys = Reflect.getOwnMetadataKeys(target)
    const tokens =
      [
        ...new Set(keys.map((key) => Reflect.getMetadata(key, target)).flat()),
      ] || []
    let injections = tokens.map((token: any) => Injector.resolve(token))

    if (keys.includes(metadataConstants.IMPORTS)) {
      const exportedTokens = Reflect.getMetadata(
        metadataConstants.IMPORTS,
        target,
      )
      const tokens =
        exportedTokens
          .map(
            (t) =>
              Reflect.hasMetadata(metadataConstants.EXPORTS, t) &&
              Reflect.getMetadata(metadataConstants.EXPORTS, t),
          )
          .filter((item) => item)
          .flat() || []

      injections = [...injections, ...tokens.map(Injector.resolve)]
    }

    this.depInstances.set(target.name, new target(...injections))

    return new target(...injections)
  }
}

export const Resolver = new Injector()
