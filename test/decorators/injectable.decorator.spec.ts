import { expect } from 'chai'
import { Injectable } from '../../lib/decorators/injectable.decorator'

describe('@Injectable', () => {
  @Injectable()
  class TestClass {
    constructor(first: string, second: number) {}
  }

  it('should enhance component with "design:paramtypes" metadata', () => {
    const constructorParams = Reflect.getMetadata(
      'design:paramtypes',
      TestClass,
    )

    expect(constructorParams[0]).to.be.eql(String)
    expect(constructorParams[1]).to.be.eql(Number)
  })
})
