import React from "react";
import useFoobar from "./store/useFoobar";
import useRenderTime from "./utils/useRenderTime";

import "./styles.css";

export default ({name}) => {
  const [{bar}] = useFoobar();
  const renderTime = useRenderTime([bar]);

  return (
    <>
      <div>
        Bar {name}:
        <span>{bar}</span>
      </div>
      <div>
        Render at:
        <span>{renderTime}</span>
      </div>
    </>
  );
}
