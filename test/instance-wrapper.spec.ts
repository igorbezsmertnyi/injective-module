import { expect } from 'chai'
import { Module, Injectable } from '../lib/decorators'
import { InstanceWrapper } from '../lib/instance-wrapper'

describe('InstanceWrapper', () => {
  @Injectable()
  class TestingClassOne {}
  @Injectable()
  class TestingClassTwo {}

  @Injectable()
  class TestClass {
    constructor(
      public classOne: TestingClassOne,
      public classTwo: TestingClassTwo,
    ) {}
  }

  interface InstanceDeps {
    testClass: TestClass
  }

  @Module({
    providers: [TestClass],
  })
  class SubjectClass extends InstanceWrapper<InstanceDeps> {}

  const testingClassOne = new TestingClassOne()
  const testingClassTwo = new TestingClassTwo()
  const testClass = new TestClass(testingClassOne, testingClassTwo)

  it('should have instacese method which returns dependencies from TestClass', () => {
    const subject = new SubjectClass(testClass)

    expect(subject.instances.testClass.classOne).instanceof(TestingClassOne)
    expect(subject.instances.testClass.classTwo).instanceof(TestingClassTwo)
  })
})
