import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Calendar from "../screens/Calendar";

const TabNavigation = createStackNavigator();

export default () => {
  return (
    <TabNavigation.Navigator headerMode="none" mode="card">
      <TabNavigation.Screen name="Home" component={Home} />
      <TabNavigation.Screen name="Calendar" component={Calendar} />
    </TabNavigation.Navigator>
  );
};
