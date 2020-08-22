import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import AntDesign from "react-native-vector-icons/AntDesign";
import TodoModal from "../components/TodoModal";
import { colors } from "../styles";
import {
  CANCEL,
  DELETE,
  EDIT_LIST,
  DELETE_LIST,
  WHAT_WANT,
  SERIOUSLY_DELETE_LIST,
  LIGHT_MODE,
} from "../words";
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
    const { screenLists } = props;

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

  deleteLongPress = (screenList, deleteList) => {
    console.log("screenList: ", screenList);
    Alert.alert(
      SERIOUSLY_DELETE_LIST,
      "",
      [
        {
          text: CANCEL,
          onPress: () => null,
        },
        {
          text: DELETE,
          onPress: deleteList.bind(this, screenList),
        },
      ],
      /*
        Alert 띄웠을 때 - 뒤로가기 버튼으로 Alert를 끄려면,
        4번째 parameter에 { cancelable: true } 설정
      */
      { cancelable: true }
    );
  };

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

  renderItem = (
    showListVisible,
    screenLists,
    toggleReviseList,
    screenList,
    deleteList,
    item
  ) => {
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
            WHAT_WANT,
            "",
            [
              {
                text: CANCEL,
                onPress: () => null,
              },
              {
                text: EDIT_LIST,
                onPress: toggleReviseList.bind(this, targetScreenList),
              },
              {
                text: DELETE_LIST,
                onPress: this.deleteLongPress.bind(
                  this,
                  targetScreenList,
                  deleteList
                ),
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
          <AntDesign name="plus" color={colors.whiteColor} size={vw(4)} />
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
    const {
      mode,
      screenLists,
      updateList,
      deleteList,
      toggleCalendarModal,
      toggleReviseList,
    } = this.props;
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
        {Platform.OS === "android" && <View style={{ flex: 0.6 }}></View>}
        {Platform.OS === "ios" && (
          <>
            <View style={{ flex: 0.6 }}></View>
            <View
              style={{
                flex: 0.8,
                justifyContent: "center",
                backgroundColor: lightWhiteTheme,
                zIndex: 5,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.backButton,
                  {
                    backgroundColor: lightblackTheme,
                    shadowColor: lightblackTheme,
                  },
                ]}
                onPress={toggleCalendarModal}
              >
                <AntDesign
                  name="arrowleft"
                  color={lightWhiteTheme}
                  size={vw(7)}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
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
              screenLists,
              toggleReviseList,
              screenList,
              deleteList
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
    paddingHorizontal: 30,
  },
  emptyDateButton: {
    width: vw(8),
    height: vw(8),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(39, 177, 246, 0.6)",
    borderRadius: 50,
  },
  backButton: {
    width: vh(6),
    height: vh(6),
    justifyContent: "center",
    alignItems: "center",
    left: 15,
    borderRadius: 50,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
});
