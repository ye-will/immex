import React, { ChangeEvent } from 'react';
import useFoobar, { FoobarType } from './store/useFoobar';
import fixCursor from './utils/fixCursor';
import Foo from './Foo';
import Bar from './Bar';

function App() {
  const [{bar}, dispatch, status] = useFoobar();
  const onChangeBar = fixCursor((e: ChangeEvent<HTMLInputElement>) => dispatch(FoobarType.UpdateBar, e.target.value).then(result => console.log(result)));

  return (
    <div className="App">
      <h1>Hello Immex</h1>
      <div>
        status:
        <span>
          {status.loading ? "loading" : "done"}
        </span>
      </div>
      <div>
        update-foo:
        <button onClick={() => dispatch(FoobarType.UpdateFoo)}>
          update
        </button>
      </div>
      <div>
        update-bar:
        <span>
          <input value={bar} onChange={onChangeBar}/>
        </span>
      </div>
      <div>
        error:
        <button onClick={() => dispatch(FoobarType.Error).catch(err => console.error(err))}>
          error
        </button>
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
