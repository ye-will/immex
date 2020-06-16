import { ChangeEvent, ChangeEventHandler } from 'react';

// a helper function to retain cursor position after input value changes
export default (handler: ChangeEventHandler) => (e: ChangeEvent<HTMLInputElement>) => {
  const { target } = e;
  const { selectionStart, selectionEnd } = target;
  handler(e);
  setTimeout(() => target.setSelectionRange(selectionStart as number, selectionEnd as number));
}
