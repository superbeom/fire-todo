import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  colors,
  backgroundColors,
  lightBackgroundTransparentColors,
  darkBackgroundTransparentColors,
} from "../styles";
import TodoModal from "./TodoModal";
import {
  SERIOUSLY_DELETE_LIST,
  DELETE,
  CANCEL,
  EDIT_LIST,
  DELETE_LIST,
  WHAT_WANT,
  LIGHT_MODE,
} from "../words";
import moment from "moment";

class TodoList extends PureComponent {
  state = {
    showListVisible: false,
  };

  setShowListVisible = (visible) => {
    this.setState({ showListVisible: visible });
  };

  toggleListModal = (showListVisible) => {
    this.setShowListVisible(!showListVisible);
  };

  deleteLongPress = (screenList, deleteList) => {
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

  render() {
    const { showListVisible } = this.state;
    const {
      screenList,
      updateList,
      deleteList,
      toggleReviseList,
      mode,
    } = this.props;

    const completedCount = screenList.todos.filter((todo) => todo.completed)
      .length;
    const remainingCount = screenList.todos.length - completedCount;
    const colorIndex = backgroundColors.indexOf(screenList.color);

    const originDate = moment(new Date()).format();
    const splitDate = originDate.split("-");
    const startDate = moment(
      `${parseInt(splitDate[0])}.${parseInt(splitDate[1])}.${parseInt(
        splitDate[2].substring(0, 2)
      )}`,
      "YYYY.MM.DD"
    );
    const endDate = moment(
      `${screenList.year}.${screenList.month}.${screenList.date}`,
      "YYYY.MM.DD"
    );
    const remainingDay = endDate.diff(startDate, "days");

    return (
      <View>
        <Modal
          animationType="slide"
          visible={showListVisible}
          onRequestClose={this.toggleListModal.bind(this, showListVisible)}
        >
          <TodoModal
            screenList={screenList}
            closeModal={this.toggleListModal.bind(this, showListVisible)}
            updateList={updateList}
            remainingDay={remainingDay}
            mode={mode}
          />
        </Modal>
        <View
          style={[
            styles.remainingContainer,
            {
              backgroundColor:
                mode === LIGHT_MODE
                  ? lightBackgroundTransparentColors[colorIndex]
                  : darkBackgroundTransparentColors[colorIndex],
            },
          ]}
        >
          <Text
            style={[
              styles.remainingTitle,
              {
                color:
                  remainingDay < 4
                    ? "red"
                    : mode === LIGHT_MODE
                    ? colors.blackColor
                    : colors.whiteColor,
              },
            ]}
          >
            {remainingDay === 0
              ? `D-Day!!`
              : remainingDay > 0
              ? `D-${remainingDay}`
              : `D+${Math.abs(remainingDay)}`}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.screenListContainer,
            { backgroundColor: screenList.color },
          ]}
          onPress={this.toggleListModal.bind(this, showListVisible)}
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
                  onPress: toggleReviseList.bind(this, screenList),
                },
                {
                  text: DELETE_LIST,
                  onPress: this.deleteLongPress.bind(
                    this,
                    screenList,
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
          <Text style={styles.screenListTitle} numberOfLines={1}>
            {screenList.name}
          </Text>

          <View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.count}>{remainingCount}</Text>
              <Text style={styles.subtitle}>Remaining</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.count}>{completedCount}</Text>
              <Text style={styles.subtitle}>Completed</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default TodoList;

const styles = StyleSheet.create({
  screenListContainer: {
    width: vw(48),
    paddingVertical: vh(29) * 0.12,
    paddingHorizontal: vh(29) * 0.08,
    borderRadius: 6,
    marginHorizontal: vw(48) * 0.06,
    alignItems: "center",
  },
  screenListTitle: {
    fontSize: vw(6),
    fontWeight: "700",
    color: colors.whiteColor,
    marginBottom: vw(4),
  },
  count: {
    fontSize: vw(12),
    fontWeight: "200",
    color: colors.whiteColor,
  },
  subtitle: {
    fontSize: vw(3),
    fontWeight: "700",
    color: colors.whiteColor,
  },
  remainingContainer: {
    width: vw(48),
    paddingVertical: vw(48) * 0.08,
    paddingHorizontal: vh(29) * 0.08,
    borderRadius: 6,
    marginHorizontal: vw(48) * 0.06,
    alignItems: "center",
    marginBottom: vh(1.3),
  },
  remainingTitle: {
    fontSize: vw(48) * 0.14,
    fontWeight: "700",
  },
});
