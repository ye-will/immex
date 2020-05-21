// a helper function to retain cursor position after input value changes
export default handler => e => {
  const { target } = e;
  const { selectionStart, selectionEnd } = target;
  handler(e);
  setTimeout(() => target.setSelectionRange(selectionStart, selectionEnd));
}
