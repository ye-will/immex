import React from "react";
import useFoobar from "./store/useFoobar";
import useRenderTime from "./utils/useRenderTime";

export default () => {
  const [{foo}] = useFoobar();
  const renderTime = useRenderTime([foo]);
  return (
    <>
      <div>
        Foo:
        <span>{foo}</span>
      </div>
      <div>
        Render at:
        <span>{renderTime}</span>
      </div>
    </>
  );
}
