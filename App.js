import React, { useState } from "react";
import NavController from "./components/NavController";

export default App = () => {
  const [mainMode, setMainMode] = useState(null);

  return <NavController mainMode={mainMode} setMainMode={setMainMode} />;
};
