import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Agenda } from "react-native-calendars";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";
import moment from "moment";

export default ({ route }) => {
  // const { mode } = route.params;

  // const mode = LIGHT_MODE;
  const mode = "bk mode test";

  const [items, setItems] = useState({});
  const lightWhiteTheme =
    mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor;
  const lightblackTheme =
    mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor;

  const vacation = { key: "vacation", color: "#00b894" };
  const massage = { key: "massage", color: "#0984e3" };
  const workout = { key: "workout", color: "#6c5ce7" };

  const timeToString = (time) => {
    const date = moment(time).format();
    return date.split("T")[0];
  };

  const loadItems = (day) => {
    console.log("day: ", day);
    setTimeout(() => {
      for (let i = 0; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          // const numItems = Math.floor(Math.random() * 3 + 1);
          // for (let j = 0; j < numItems; j++) {
          //   this.state.items[strTime].push({
          //     name: "Item for " + strTime + " #" + j,
          //     height: Math.max(50, Math.floor(Math.random() * 150)),
          //   });
          // }
        }
      }
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={[styles.item, { height: item.height }]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>+</Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: lightWhiteTheme,
      }}
    >
      <View style={{ flex: 0.6 }}></View>
      <View style={{ flex: 12 }}>
        {/* <Agenda
          loadItemsForMonth={(month) => {
            console.log("month: ", month);
          }}
          // items={{
          //   "2020-08-22": [{ name: "item 1 - any js object" }],
          //   "2020-08-23": [{ name: "item 2 - any js object", height: 80 }],
          //   "2020-08-24": [],
          //   "2020-08-25": [
          //     { name: "item 3 - any js object" },
          //     { name: "any js object" },
          //   ],
          // }}
        /> */}
        <Agenda
          current={moment().format()}
          minDate={moment().format()}
          items={items}
          loadItemsForMonth={loadItems}
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          markingType={"multi-dot"}
          markedDates={{
            "2020-08-23": { dots: [vacation, massage, workout] },
            "2020-08-24": { dots: [massage, workout] },
          }}
          theme={{
            calendarBackground: lightWhiteTheme,
            agendaKnobColor: lightblackTheme,
            monthTextColor: lightblackTheme,
            dayTextColor: lightblackTheme,
            textDisabledColor:
              mode === LIGHT_MODE
                ? colors.calendarTextDisabledLightModeColor
                : colors.calendarTextDisabledDarkModeColor,
            backgroundColor:
              mode === LIGHT_MODE
                ? colors.calendarThemeBackgroundLightModeColor
                : colors.calendarThemeBackgroundDarkModeColor,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {},
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    flex: 1,
    height: 15,
    paddingTop: 30,
  },
});
