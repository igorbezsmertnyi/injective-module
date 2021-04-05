import { MODULE_METADATA as metadataConstants } from '../constants'
import { InvalidModuleConfig } from '../errors/invalida-module-config.error'

const metadataKeys = [
  metadataConstants.IMPORTS,
  metadataConstants.EXPORTS,
  metadataConstants.PROVIDERS,
]

export function validateModuleKeys(keys: string[]) {
  const validateKey = (key: string) => {
    if (metadataKeys.includes(key)) {
      return
    }

    throw new InvalidModuleConfig(key)
  }
  keys.forEach(validateKey)
}
