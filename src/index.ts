/* eslint-disable */

import { useState, useEffect, useCallback, Dispatch } from 'react'
import produce, { Draft, castImmutable, Immutable } from 'immer'

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

type Unlock = () => void

const withLock = (() => {
  const tasks: Unlock[] = []
  let done = true
  const sched = () => {
    if (done && tasks.length > 0) {
      done = false;
      (tasks.shift() as Unlock)()
    }
  }
  return (callback: () => Promise<void>) => new Promise<Unlock>((reslove) => {
    const task = () => reslove(() => {
      done = true
      sched()
    })
    tasks.push(task);
    (process && process.nextTick)
      ? process.nextTick(sched)
      : setImmediate(sched)
  }).then(release => callback()
    .then(() => {
      release()
    })
    .catch(err => {
      release()
      throw err
    })
  )
})()

class Store<U extends any[]> {
  state: Immutable<U[0]>
  readonly listeners: Set<Dispatch<Immutable<U[0]>>>
  readonly immerReducer: <Base extends Immutable<U[0]>>(base: Base, ...rest: Tail<Parameters<Reducer<U>>>) => Base

  constructor(reducer: Reducer<U>, initialValue: U[0]) {
    this.immerReducer = produce(reducer)
    this.state = castImmutable(produce(initialValue, _ => {}))
    this.listeners = new Set()
  }

  async dispatch(...args: Tail<Parameters<Reducer<U>>>) {
    return withLock(() => Promise.resolve(this.immerReducer(this.state, ...args)).then(result => {
      this.state = result
      this.listeners.forEach(listener => listener(result))
    }))
  }
}

// type Immex<U extends any[]> = (reducer: Reducer<U>, initialValue?: U[0]) => () => [Immutable<U[0]>, (...args: Tail<Parameters<Reducer<U>>>) => void]
type ImmexDispatcher<U extends any[]> = (...args: Tail<Parameters<Reducer<U>>>) => Promise<void>

const immex = <U extends any[]>(reducer: Reducer<U>, initialValue: U[0]) => {
  const store = new Store<U>(reducer, initialValue)
  return (): [Immutable<U[0]>, ImmexDispatcher<U>] => {
    const [localState, localUpdate] = useState(() => store.state)
    const disptach: ImmexDispatcher<U> = useCallback((...args) => store.dispatch(...args), [])
    useEffect(() => {
      store.listeners.add(localUpdate)
      return () => {
        store.listeners.delete(localUpdate)
      }
    }, [disptach])
    return [localState, disptach]
  }
}

export default immex
