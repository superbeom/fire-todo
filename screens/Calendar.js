import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import TodoModal from "../components/TodoModal";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";
import moment from "moment";

class Calendar extends PureComponent {
  state = {
    items: {},
    markingItems: {},
    scheduleItems: [],
    markedDates: {},
    showListVisible: false,
    screenList: {},
    remainingDay: 0,
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

  setShowListVisible = (visible, targetScreenList, targetRemainingDay) => {
    this.setState({
      showListVisible: visible,
      screenList: targetScreenList,
      remainingDay: targetRemainingDay,
    });
  };

  toggleListModal = (showListVisible, targetScreenList, targetRemainingDay) => {
    this.setShowListVisible(
      !showListVisible,
      targetScreenList,
      targetRemainingDay
    );
  };

  timeToString = (time) => {
    const date = moment(time).format();
    return date.split("T")[0];
  };

  loadItems = (items, markingItems, scheduleItems, markedDates, day) => {
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

    if (Object.keys(markedNewItems).length > 0) {
      this.setState({ items: newItems, markedDates: markedNewItems });
    }
  };

  renderItem = (showListVisible, screenLists, item) => {
    const targetScreenList = screenLists.filter(
      (screenList) => screenList.name === item.name
    )[0];
    const originDate = moment(new Date()).format();
    const splitDate = originDate.split("-");
    const startDate = moment(
      `${parseInt(splitDate[0])}.${parseInt(splitDate[1])}.${parseInt(
        splitDate[2].substring(0, 2)
      )}`,
      "YYYY.MM.DD"
    );
    const endDate = moment(
      `${targetScreenList.year}.${targetScreenList.month}.${targetScreenList.date}`,
      "YYYY.MM.DD"
    );
    const targetRemainingDay = endDate.diff(startDate, "days");

    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: item.color,
          },
        ]}
        onPress={this.toggleListModal.bind(
          this,
          showListVisible,
          targetScreenList,
          targetRemainingDay
        )}
        onLongPress={() => {
          Alert.alert(
            "WHAT_WANT",
            "",
            [
              {
                text: "CANCEL",
                onPress: () => null,
              },
            ],
            /*
              Alert 띄웠을 때 - 뒤로가기 버튼으로 Alert를 끄려면,
              4번째 parameter에 { cancelable: true } 설정
            */
            { cancelable: true }
          );
        }}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderEmptyDate = (day) => {
    // const selectedDay = day.split("T")[0];
    return (
      <View style={styles.emptyDate}>
        <TouchableOpacity
          style={styles.emptyDateButton}
          onPress={() => {
            // console.log("day: ", day, typeof day);
            return null;
          }}
        >
          <Text style={styles.emptyDateText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      items,
      markingItems,
      scheduleItems,
      markedDates,
      showListVisible,
      screenList,
      remainingDay,
    } = this.state;
    const { mode, screenLists, updateList } = this.props.route.params;
    const lightWhiteTheme =
      mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor;
    const lightblackTheme =
      mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor;

    console.log("Calendar");

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: lightWhiteTheme,
        }}
      >
        <Modal
          animationType="slide"
          visible={showListVisible}
          onRequestClose={this.toggleListModal.bind(
            this,
            showListVisible,
            [],
            0
          )}
        >
          <TodoModal
            screenList={screenList}
            closeModal={this.toggleListModal.bind(this, showListVisible, [], 0)}
            updateList={updateList}
            remainingDay={remainingDay}
            mode={mode}
          />
        </Modal>
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
            renderItem={this.renderItem.bind(
              this,
              showListVisible,
              screenLists
            )}
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
