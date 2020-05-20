# Immex

- based on immer.js
- (global) statement management
- react hooks friendly
- insanely easy to use, just one API
- support async/await reducers

## Installation

```shell
npm install --save immex immer
```

## Usage

Define your store/reducer and export the react hook

```javascript
// useCalculator.js
import immex from 'immex'

const calculator = (draft, {operator, payload}) => {
  switch (operator) {
    case 'add':
      draft.value += payload
      break
    case 'sub':
      draft.value -= payload
      break
    default:
  }
}

const useCalculator = immex(calculator, {value: 0})
export default useCalculator
```

Use the exported react hook in function components, any change to the state will be updated in all components automatically

```javascript
// foo.tsx
import React from 'react'
import useCalculator from './useCalculator'

export default () => {
  const [{value}, dispatch] = useCalculator()
  return (
    <>
      <div>
        <span>Foo:</span>
        {value}
      </div>
      <div>
        <button onClick={() => dispatch({ operator: "add", payload: 1 })}>+</button>
        <button onClick={() => dispatch({ operator: "sub", payload: 1})}>-</button>
      </div>
    </>
  )
}
```

```javascript
// bar.tsx
import React from 'react'
import useCalculator from './useCalculator'

export default () => {
  const [{value}] = useCalculator()
  // this value keeps update to the one in component foo
  return (
    <div>
      <span>Bar:</span>
      {value}
    </div>
  )
}
```
