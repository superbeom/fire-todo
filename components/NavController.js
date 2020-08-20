import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "../navigation/TabNavigation";

export default ({ mainMode, setMainMode }) => (
  <NavigationContainer>
    <TabNavigation mainMode={mainMode} setMainMode={setMainMode} />
  </NavigationContainer>
);
