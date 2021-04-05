import { expect } from 'chai'
import { InvalidModuleConfig } from '../../lib/errors/invalida-module-config.error'

describe('InvalidModuleConfig', () => {
  it('should have type and proper error message', () => {
    const subject = new InvalidModuleConfig('test')
    expect(subject.type).to.be.eq('INVALID_MODULE_CONFIG_MESSAGE')
    expect(subject.message).to.be.eq(
      "Invalid property 'test' passed into the @Module() decorator.",
    )
  })
})
