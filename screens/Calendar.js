import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Agenda } from "react-native-calendars";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";
import moment from "moment";

let count = 0;

class Calendar extends PureComponent {
  state = {
    items: {},
    markingItems: {},
    scheduleItems: [],
    markedDates: {},
  };

  static getDerivedStateFromProps(props, state) {
    const {
      route: {
        params: { screenLists },
      },
    } = props;

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

      return {
        scheduleItems: tempItems,
      };
    } catch (error) {
      console.log("error: ", error);
    }
  }

  timeToString = (time) => {
    const date = moment(time).format();
    return date.split("T")[0];
  };

  loadItems = (items, markingItems, scheduleItems, markedDates, day) => {
    // console.log("day: ", day);
    for (let i = 0; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);
      const scheduleTempItems = scheduleItems.filter(
        (scheduleItem) => scheduleItem.when === strTime
      );
      if (!items[strTime]) {
        items[strTime] = [];
        markingItems[strTime] = [];
        markedDates[strTime] = [];
        for (let j = 0; j < scheduleTempItems.length; j++) {
          items[strTime].push({
            name: scheduleTempItems[j].name,
            color: scheduleTempItems[j].color,
          });
          markingItems[strTime].push({ color: scheduleTempItems[j].color });
        }
        const markingItemsColors = markingItems[strTime].map((markingItem) => {
          return { color: markingItem.color };
        });
        if (markingItemsColors.length > 0) {
          markedDates[strTime].push({ dots: markingItemsColors });
        }
      }
    }
    const newItems = {};
    const markedNewItems = {};
    Object.keys(items).forEach((key) => {
      newItems[key] = items[key];
    });
    Object.keys(markedDates).forEach((key) => {
      if (markedDates[key].length > 0) {
        markedNewItems[key] = markedDates[key][0];
      }
    });
    if (count === 0) {
      /*
        처음엔 markedDates가 제대로 들어 가는데,
        3번 로드돼서, 2번째와 3번째에는 빈 {}가 들어감.
        그래서 count 처리.
      */
      this.setState({ items: newItems, markedDates: markedNewItems });
      count++;
    }
  };

  renderItem = (item) => {
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

  renderEmptyDate = (day) => {
    const selectedDay = moment(day).format().split("T")[0];
    return (
      <View style={styles.emptyDate}>
        <TouchableOpacity style={styles.emptyDateButton} onPress={() => null}>
          <Text style={styles.emptyDateText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { items, markingItems, scheduleItems, markedDates } = this.state;
    const { mode } = this.props.route.params;
    const lightWhiteTheme =
      mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor;
    const lightblackTheme =
      mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor;

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
            loadItemsForMonth={this.loadItems.bind(
              this,
              items,
              markingItems,
              scheduleItems,
              markedDates
            )}
            renderItem={this.renderItem}
            renderEmptyDate={this.renderEmptyDate}
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
  }
}

export default Calendar;

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
