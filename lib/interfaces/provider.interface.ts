import { Type } from './type.interface'
import { Abstract } from './abstract.interface'

export interface ClassProvider<T = any> {
  provide: string | symbol | Type<any> | Abstract<any> | Function
  useClass: Type<T>
}

export type Provider<T = any> = Type<T>
