import React from "react";
import { YellowBox } from "react-native";
import NavController from "./components/NavController";

export default App = () => {
  YellowBox.ignoreWarnings([
    "Non-serializable values were found in the navigation state",
  ]);

  return <NavController />;
};
