import { expect } from 'chai'
import { Resolver } from '../lib/injector'
import { Module, Injectable } from '../lib/decorators'
import { InstanceWrapper } from '../lib/instance-wrapper'

describe('Resolver', () => {
  @Injectable()
  class TestClassOne {
    say() {
      return 'one'
    }
  }
  @Injectable()
  class TestClassTwo {
    say() {
      return 'two'
    }
  }
  @Injectable()
  class TestProvider {
    constructor(
      public testClassOne: TestClassOne,
      public testClassTwo: TestClassTwo,
    ) {}
  }

  const moduleMetadata = {
    providers: [TestProvider],
  }

  interface InstanceDeps {
    testProvider: TestProvider
  }

  it('should resolve the TestProvider dependencies', () => {
    @Module(moduleMetadata)
    class TestModuleOne extends InstanceWrapper<InstanceDeps> {}

    const testModule = Resolver.resolve<InstanceDeps>(TestModuleOne)
    expect(testModule.instances.testProvider.testClassOne).instanceof(
      TestClassOne,
    )
    expect(testModule.instances.testProvider.testClassTwo).instanceof(
      TestClassTwo,
    )
  })

  it('should give access to exported dependencies', () => {
    @Module({
      ...moduleMetadata,
      exports: [TestProvider],
    })
    class TestModuleTwo extends InstanceWrapper<
      InstanceDeps,
      any,
      InstanceDeps
    > {}

    const testModule = Resolver.resolve<InstanceDeps>(TestModuleTwo)
    expect(testModule.exports.testProvider).instanceof(TestProvider)
  })
})
