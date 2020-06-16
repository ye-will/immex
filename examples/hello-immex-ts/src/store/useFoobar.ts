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
  UpdateBar
}

const calculator = (draft: Draft<Foobar>, type: FoobarType, payload: string) => {
  switch (type) {
    case FoobarType.UpdateFoo:
      draft.foo = payload
      break
    case FoobarType.UpdateBar:
      draft.bar = payload
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
