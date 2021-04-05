# Injective module
---

This module developed to provide friendly syntaxes for dependency injections in TypeScript projects.

### Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Decorators](#decorators)

## Installation

```bash
$ npm install injective-module
```

## Usage

### Basic usage

This example shows how to resolve the dependencies in the class without initializing the children's instances.

```ts
import { Injectable, Resolver } from 'injective-module'

@Injectable()
class FirstClass {
  say() {
    console.log('This is first class')
  }
}

@Injectable()
class SecondClass {
  say() {
    console.log('This is second class')
  }
}

class MainClass {
  constructor(
    public readonly firstClass: FirstClass,
    public readonly secondClass: SecondClass,
  )
}

const mainClass = Resolver.resolve<MainClass>(MainClass)
mainClass.firstClass.say() // This is first class
mainClass.secondClass.say() // This is second class
```

### Usege with @Module

This example shows how to resolve the dependencies in the class with the `@Module` decorator.

```ts
import { Injectable, Module, Resolver, InstanceWrapper } from 'injective-module'

@Injectable()
class FirstPrivider {
  say() {
    console.log('This is first provider')
  }
}

@Injectable()
class SecondProvider {
  say() {
    console.log('This is second provider')
  }
}

class FirstService {
  constructor(
    public readonly firstPrivider: FirstPrivider,
    public readonly secondProvider: SecondProvider,
  )
}

@Module({
  providers: [FirstPrivider, SecondProvider, FirstService],
  exports: [FirstService],
})
export class FirstModule {}

@Module({
  imports: [FirstModule],
})
export class ApplicationModule extends InstanceWrapper<{
  firstModule: FirstModule
}> {
  onInit() {
    console.log(this.instances) // { firstModule: FirstModule }
    console.log(this.imports) // { firstModule: FirstModule }
    console.log(this.exports) // {}
  }
}

const applicationModule = Resolver.resolve<InstanceWrapper<{
  firstModule: FirstModule
}>>(ApplicationModule)

console.log(applicationModule.instances) // { firstModule: FirstModule }
console.log(applicationModule.imports) // { firstModule: FirstModule }
console.log(applicationModule.exports) // {}
```

## Decorators

### @Injectable

The `@Injectable()` decorator used for defining the contructors implementation metadata and getting it in application via `Reflect`

Example:
```ts
@Injectable()
class InjectableClass {
  say() {
    console.log('Hi!')
  }
}

@Injectable()
class MainClass {
  constructor(private injectableClass: InjectableClass) { }
}

const mainClass = Resolver.resolve<MainClass>(MainClass)
mainClass.injectableClass.say() // Hi!
```

### @Module

The `@Module()` decorator used to define `imports`, `providers` and `exports` for decorated class. Those instances will be available in a decorated class with automatically resolved dependencies. This decorator should be used along with the `InstanceWrapper` abstract class, this class allowed to retrieve interesting instances from `Reflect` metadata which is dependent on the decorated class.

| key | description | default |
|-----|-------------|---------|
| imports | This key used for importing the other modules and adding the exported instances to the decorated class. | [] |
| providers | This key used to resolving the dependencies inside the module. | [] |
| exports | Using for sharing instances between modules. | [] |

Example:
```ts
@Injectable()
class FirstClass {
  say() {
    console.log('Hi first class!')
  }
}

@Injectable()
class SecondClass {
    say() {
    console.log('Hi second class!')
  }
}

@Injectable()
class ThirdClass {
  constructor(
    private firstClass: FirstClass,
    private secondClass: SecondClass,
  ) { }
}

@Module({
  providers: [FirstClass, SecondClass, ThirdClass],
  exports: [ThirdClass]
})
class FirstModule {}

@Module({
  imports: [FirstModule]
})
class SecondModule extends InstanceWrapper<{
  firstModule: FirstModule
}> {
  onInit() {
    this.instances.firstModule.firstClass.say() // Hi first class!
    this.instances.firstModule.secondClass.say() // Hi second class!
  }
}

const secondModule = Resolver.resolve<InstanceWrapper<{
  firstModule: FirstModule
}>>(SecondModule)

// Usage outside the class
secondModule.instances.firstModule.firstClass.say() // Hi first class!
secondModule.instances.firstModule.secondClass.say() // Hi second class!
```

