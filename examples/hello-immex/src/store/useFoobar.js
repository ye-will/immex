import immex from 'immex'

const reducer = (draft, { type, payload }) => {
  switch (type) {
    case "update-foo":
      draft.foo = payload
      break
    case "update-bar":
      draft.bar = payload
      break
    case "update-any":
      return { ...draft, ...payload }
    default:
  }
}

export default immex(
  // your reducer
  reducer,
  // initial value
  {
    foo: "I'm foo",
    bar: "I'm bar",
    you: {
      can: {
        not: {
          change: {
            me: "!"
          }
        }
      }
    }
  }
)
