import React, { ChangeEvent } from 'react';
import useFoobar, { FoobarType } from './store/useFoobar';
import fixCursor from './utils/fixCursor';
import Foo from './Foo';
import Bar from './Bar';

function App() {
  const [{foo, bar}, dispatch] = useFoobar();
  const onChangeFoo = fixCursor((e: ChangeEvent<HTMLInputElement>) => dispatch(FoobarType.UpdateFoo, e.target.value));
  const onChangeBar = fixCursor((e: ChangeEvent<HTMLInputElement>) => dispatch(FoobarType.UpdateBar, e.target.value));

  return (
    <div className="App">
      <h1>Hello Immex</h1>
      <div>
        update-foo:
        <span>
          <input value={foo} onChange={onChangeFoo}/>
        </span>
      </div>
      <div>
        update-bar:
        <span>
          <input value={bar} onChange={onChangeBar}/>
        </span>
      </div>
      <hr/>
      <Foo />
      <hr/>
      <Bar name="1" />
      <hr/>
      <Bar name="2" />
    </div>
  );
}

export default App;
