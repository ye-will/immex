import { useState, useEffect } from 'react'
import produce, { Draft, castImmutable } from 'immer'

interface Reducer<T> {
  (draft: Draft<T>, ...rest: any[]): void
}

const immex = <T = any>(reducer: Reducer<T>, initialValue: T) => {
  const immerReducer = produce(reducer)
  const store = {
    state: castImmutable(produce(initialValue, _ => {})),
    listeners: []
  }
  const update = (...args: any[]) => {
    Promise.resolve(immerReducer(store.state as any, ...args)).then(result => {
      store.state = result
      for (let i = 0; i < store.listeners.length; i += 1) {
        store.listeners[i](result)
      }
    })
  }
  return () => {
    const [localState, localUpdate] = useState(store.state)
    useEffect(() => {
      store.listeners.push(localUpdate)
      return () => {
        store.listeners = store.listeners.filter(i => i !== localUpdate)
      }
    }, [])
    return [localState, update]
  }
}

export default immex
