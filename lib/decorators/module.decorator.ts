import 'reflect-metadata'
import { Provider } from '../interfaces/provider.interface'
import { Type } from '../interfaces/type.interface'
import { Abstract } from '../interfaces/abstract.interface'
import { validateModuleKeys } from '../utils/validate-module-keys.util'

interface ModuleMetadata {
  imports?: Array<Type<any>>
  providers?: Provider[]
  exports?: Array<string | symbol | Provider | Abstract<any> | Function>
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  const propsKeys = Object.keys(metadata)
  validateModuleKeys(propsKeys)

  return (target: Function) => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, (metadata as any)[property], target)
      }
    }
  }
}
