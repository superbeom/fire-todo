import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Home from "../screens/Home";
import Calendar from "../screens/Calendar";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";

const TabNavigation = createBottomTabNavigator();

export default ({ mainMode, setMainMode }) => {
  return (
    <TabNavigation.Navigator
      // initialRouteName="Home"
      initialRouteName="Calendar"
      tabBarOptions={{
        tabStyle: {
          backgroundColor:
            mainMode === LIGHT_MODE ? colors.whiteColor : colors.blackColor,
          activeTintColor: "lightblue",
        },
        showLabel: false,
        activeTintColor: "lightblue",
      }}
    >
      <TabNavigation.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => (
            <FontAwesome
              name="list"
              color={
                mainMode === LIGHT_MODE ? colors.blackColor : colors.whiteColor
              }
              size={23}
            />
          ),
        }}
        initialParams={{ setMainMode }}
      />
      <TabNavigation.Screen
        name="Calendar"
        component={Calendar}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            // Prevent default action
            event.preventDefault();
            navigation.navigate("Calendar", { mode: mainMode });
          },
        })}
        options={{
          tabBarIcon: () => (
            <FontAwesome
              name="calendar"
              color={
                mainMode === LIGHT_MODE ? colors.blackColor : colors.whiteColor
              }
              size={23}
            />
          ),
        }}
      />
    </TabNavigation.Navigator>
  );
};