import { expect } from 'chai'
import { Module } from '../../lib/decorators/module.decorator'
import { InvalidModuleConfig } from '../../lib/errors/invalida-module-config.error'

describe('@Module', () => {
  class TestProvider {}
  class TestImportModule {}
  class TestExprotModule {}

  const moduleMetadata = {
    providers: [TestProvider],
    imports: [TestImportModule],
    exports: [TestExprotModule],
  }

  @Module(moduleMetadata)
  class TestModule {}

  it('should enhance class with expected module metadata', () => {
    const imports = Reflect.getMetadata('imports', TestModule)
    const providers = Reflect.getMetadata('providers', TestModule)
    const exports = Reflect.getMetadata('exports', TestModule)

    expect(imports).to.be.eql(moduleMetadata.imports)
    expect(providers).to.be.eql(moduleMetadata.providers)
    expect(exports).to.be.eql(moduleMetadata.exports)
  })

  it('should throw exception when module properties are invalid', () => {
    const invalidMetadata = {
      ...moduleMetadata,
      test: [],
    }

    expect(Module.bind(null, invalidMetadata)).to.throw(InvalidModuleConfig)
  })
})
