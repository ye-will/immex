import { useState, useEffect, useCallback } from 'react'
import produce, { Draft, castImmutable, Immutable } from 'immer'

// type Reducer<U extends any[]> = (...args: U) => void
type Tail<T extends any[]> = ((...t: T) => any) extends (
	_: any,
	...tail: infer TT
) => any
	? TT
  : []

type Reducer<U extends any[]> = ((...args: U) => void) extends (
  draft: Draft<U[0]>,
  ...rest: Tail<U>
) => void
  ? (...args: U) => void
  : never

class Store<U extends any[]> {
  state: Immutable<U[0]>
  readonly listeners: Set<React.Dispatch<Immutable<U[0]>>>
  readonly immerReducer: <Base extends Immutable<U[0]>>(base: Base, ...rest: Tail<Parameters<Reducer<U>>>) => Base

  constructor(reducer: Reducer<U>, initialValue?: U[0]) {
    this.immerReducer = produce(reducer)
    this.state = castImmutable(produce((initialValue ?? {}) as U[0], _ => {}))
    this.listeners = new Set()
  }

  dispatch(...args: Tail<Parameters<Reducer<U>>>) {
    Promise.resolve(this.immerReducer(this.state, ...args)).then(result => {
      this.state = result
      this.listeners.forEach(listener => listener(result))
    })
  }
}

const immex = <U extends any[]>(reducer: Reducer<U>, initialValue?: U[0]) => {
  const store = new Store<U>(reducer, initialValue)
  return (): [Immutable<U[0]>, (...args: Tail<Parameters<Reducer<U>>>) => void] => {
    const [localState, localUpdate] = useState(() => store.state)
    const disptach: (...args: Tail<Parameters<Reducer<U>>>) => void = useCallback((...args) => {
      if (!store.listeners.has(localUpdate)) {
        throw new Error('update is invalid before component rendered or after component destroyed.')
      }
      store.dispatch(...args)
    }, [localUpdate])
    useEffect(() => {
      store.listeners.add(localUpdate)
      return () => {
        store.listeners.delete(localUpdate)
      }
    }, [])
    return [localState, disptach]
  }
}

export default immex
