import immex from "immex"
import { Draft } from "immer"

// immer reducer function
// refer: https://immerjs.github.io/immer/docs/curried-produce

interface Foobar {
  foo: string,
  bar: string
}

export enum FoobarType {
  UpdateFoo,
  UpdateBar,
  Error
}

const calculator = async (draft: Draft<Foobar>, type: FoobarType, payload?: string) => {
  switch (type) {
    case FoobarType.UpdateFoo:
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 2000)
      })
      draft.foo = new Date().toISOString()
      break
    case FoobarType.UpdateBar:
      draft.bar = payload || ""
      break
    case FoobarType.Error:
      await new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('error')), 2000)
      })
      break
    default:
  }
}

const useCalculator = immex(
  calculator,
  {
    foo: "I'm foo",
    bar: "I'm bar"
  } // initial state
)
export default useCalculator
