import { useEffect, useState } from "react";

const timeNow = () => (new Date()).toISOString();

export default dependencyList => {
  const [renderTime, updateRenderTime] = useState(timeNow());
  useEffect(
    () => updateRenderTime(timeNow()),
    dependencyList
  );
  return renderTime
}
