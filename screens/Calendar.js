import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Agenda } from "react-native-calendars";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";
import moment from "moment";

export default ({ route }) => {
  const [items, setItems] = useState({});
  const [scheduleItems, setScheduleItems] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const { mode, screenLists } = route.params;

  const lightWhiteTheme =
    mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor;
  const lightblackTheme =
    mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor;

  const vacation = { color: "#00b894" };
  const massage = { color: "#0984e3" };
  const workout = { color: "#6c5ce7" };

  const timeToString = (time) => {
    const date = moment(time).format();
    return date.split("T")[0];
  };

  const markingToDates = () => {
    setMarkedDates({
      "2020-08-23": {
        dots: [{ color: "black" }, { color: "pink" }, { color: "purple" }],
      },
      "2020-08-24": { dots: [massage, workout] },
    });
  };

  const loadItems = (day) => {
    // console.log("day: ", day);
    // for (let i = 0; i < 85; i++) {
    for (let i = 0; i < 10; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);
      const scheduleTempItems = scheduleItems.filter(
        (scheduleItem) => scheduleItem.when === strTime
      );
      if (!items[strTime]) {
        items[strTime] = [];
        for (let j = 0; j < scheduleTempItems.length; j++) {
          items[strTime].push({
            name: scheduleTempItems[j].name,
            color: scheduleTempItems[j].color,
          });
        }
      }
    }
    const newItems = {};
    Object.keys(items).forEach((key) => {
      newItems[key] = items[key];
    });
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: item.color,
          },
        ]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = (day) => {
    const selectedDay = moment(day).format().split("T")[0];
    return (
      <View style={styles.emptyDate}>
        <TouchableOpacity style={styles.emptyDateButton} onPress={() => null}>
          <Text style={styles.emptyDateText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const preLoad = () => {
    try {
      const tempItems = screenLists.map((screenList) => {
        return {
          when: `${moment(screenList.getTime).format("YYYY")}-${moment(
            screenList.getTime
          ).format("MM")}-${moment(screenList.getTime).format("DD")}`,
          name: screenList.name,
          color: screenList.color,
        };
      });
      setScheduleItems((scheduleItems) => [...tempItems]);

      markingToDates();
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    preLoad();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: lightWhiteTheme,
      }}
    >
      <View style={{ flex: 0.6 }}></View>
      <View style={{ flex: 12 }}>
        <Agenda
          current={moment().format()}
          minDate={moment().format()}
          items={items}
          loadItemsForMonth={loadItems}
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          markingType={"multi-dot"}
          markedDates={markedDates}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    fontSize: vw(4),
    color: colors.whiteColor,
  },
  emptyDate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    height: 15,
    paddingTop: 30,
    paddingHorizontal: 50,
  },
  emptyDateButton: {
    width: vw(8),
    height: vw(8),
    backgroundColor: "rgba(39, 177, 246, 0.6)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDateText: {
    color: colors.whiteColor,
    fontSize: 16,
  },
});
