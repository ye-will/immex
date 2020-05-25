import { useState, useEffect, useCallback } from 'react'
import produce, { Draft, castImmutable } from 'immer'

interface Reducer<T> {
  (draft: Draft<T>, ...rest: any[]): void
}

const immex = <T = any>(reducer: Reducer<T>, initialValue?: T) => {
  const immerReducer = produce(reducer)
  const store = {
    state: castImmutable(produce(initialValue ?? {}, _ => {})),
    listeners: new Set()
  }
  const iDisptach = (...args: any[]) => Promise.resolve(immerReducer(store.state as any, ...args)).then(result => {
    store.state = result
    store.listeners.forEach((listener: any) => listener(result))
  })
  return () => {
    const [localState, localUpdate] = useState(() => store.state)
    const disptach = useCallback((...args: any[]) => {
      if (!store.listeners.has(localUpdate)) {
        throw new Error('update is invalid before component rendered or after component destroyed.')
      }
      iDisptach(...args)
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
