import { useState, useEffect, useCallback, Dispatch } from 'react'
import produce, { Draft, castImmutable, castDraft, Immutable } from 'immer'

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
type Locker<T> = (callback: () => Promise<T>) => Promise<T>

const locker = <T extends any>(): Locker<T> => {
  const tasks: Unlock[] = []
  let done = true
  const schedule = () => {
    if (done && tasks.length > 0) {
      done = false;
      (tasks.shift() as Unlock)()
    }
  }
  return (callback: () => Promise<T>) => new Promise<Unlock>((resolve) => {
    const task = () => resolve(() => {
      done = true
      schedule()
    })
    tasks.push(task);
    schedule();
  }).then(release => callback()
    .then(result => {
      release()
      return result
    })
    .catch(err => {
      release()
      throw err
    })
  )
}

type ImmexStatus = {
  loading: boolean
}

class Store<U extends any[]> {
  state: Immutable<U[0]>
  readonly listeners: Set<Dispatch<Immutable<U[0]>>>
  readonly status: Set<Dispatch<ImmexStatus>>
  readonly immerReducer: <Base extends Immutable<U[0]>>(base: Base, ...rest: Tail<Parameters<Reducer<U>>>) => Base
  readonly withLock: Locker<Immutable<U[0]>>

  constructor(reducer: Reducer<U>, initialValue: U[0]) {
    this.withLock = locker()
    this.immerReducer = produce(reducer)
    this.state = castImmutable(produce(initialValue, _ => {}))
    this.listeners = new Set()
    this.status = new Set()
  }

  loading(loading: boolean) {
    this.status.forEach(setStatus => setStatus({loading}))
  }

  async dispatch(...args: Tail<Parameters<Reducer<U>>>) {
    return this.withLock(() => {
      this.loading(true)
      return Promise.resolve(this.immerReducer(this.state, ...args)).then(result => {
        this.state = result
        this.listeners.forEach(listener => listener(result))
        this.loading(false)
        return result
      }).catch(err => {
        this.loading(false)
        throw err
      })
    })
  }
}

// type Immex<U extends any[]> = (reducer: Reducer<U>, initialValue?: U[0]) => () => [Immutable<U[0]>, (...args: Tail<Parameters<Reducer<U>>>) => void]
type ImmexDispatcher<U extends any[]> = (...args: Tail<Parameters<Reducer<U>>>) => Promise<Immutable<U[0]>>
type ImmexInitParams<U extends any[]> = [] | Parameters<ImmexDispatcher<U>>

function isInitParams<U extends any[]>(init: ImmexInitParams<U>): init is Parameters<ImmexDispatcher<U>> {
  return init.length > 0
}

const immex = <U extends any[]>(reducer: Reducer<U>, initialValue: U[0]) => {
  const store = new Store<U>(reducer, initialValue)
  return (...init: ImmexInitParams<U>): [Draft<Immutable<U[0]>>, ImmexDispatcher<U>, ImmexStatus] => {
    const [localState, localUpdate] = useState(() => store.state)
    const [status, statusUpdate] = useState(() => ({
      loading: false
    }))
    const dispatch: ImmexDispatcher<U> = useCallback((...args) => store.dispatch(...args), [])
    useEffect(() => {
      store.status.add(statusUpdate)
      store.listeners.add(localUpdate)
      if (isInitParams(init)) {
        dispatch(...init)
      }
      return () => {
        store.listeners.delete(localUpdate)
        store.status.delete(statusUpdate)
      }
    }, [dispatch])
    return [castDraft(localState), dispatch, status]
  }
}

export default immex
