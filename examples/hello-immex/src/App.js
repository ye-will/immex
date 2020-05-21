import React from "react";
import useFoobar from "./store/useFoobar";
import "./styles.css";
import Foo from "./Foo";
import Bar from "./Bar";
import fixCursor from './utils/fixCursor';

export default () => {
  const [data, update] = useFoobar();
  const {foo, bar} = data;

  const brokenUpdate = () => {
    try {
      data.you.can.not.change.me = "?";
    } catch (e) {
      console.error(e);
    }
  }

  const onChangeFoo = fixCursor(e => update({
    type: "update-foo",
    payload: e.target.value
  }));

  const onChangeBar = fixCursor(e => update({
    type: "update-bar",
    payload: e.target.value
  }));

  const onChangeAny = field => fixCursor(e => {
    let payload = {}
    payload[field] = e.target.value
    update({
      type: "update-any",
      payload
    })
  });

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
      <div>
        update-any:
        <span>
          <input value={foo} onChange={onChangeAny("foo")}/>
          <input value={bar} onChange={onChangeAny("bar")}/>
        </span>
      </div>
      <div>
        try to touch 'data.you.can.not.change.me' out of 'update'
        <button style={{marginLeft: "4px"}} onClick={brokenUpdate}>hack it</button>
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
