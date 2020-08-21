import React, { useState } from "react";
import { YellowBox } from "react-native";
import NavController from "./components/NavController";

export default App = () => {
  const [mainMode, setMainMode] = useState(null);

  YellowBox.ignoreWarnings([
    "Non-serializable values were found in the navigation state",
  ]);

  return <NavController mainMode={mainMode} setMainMode={setMainMode} />;
};
