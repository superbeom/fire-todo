import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
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

export default ({
  screenList,
  updateList,
  deleteList,
  toggleReviseList,
  mode,
}) => {
  const [showListVisible, setShowListVisible] = useState(false);
  const completedCount = screenList.todos.filter((todo) => todo.completed)
    .length;
  const remainingCount = screenList.todos.length - completedCount;
  const colorIndex = backgroundColors.indexOf(screenList.color);

  const remainingDay = () => {
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

    return endDate.diff(startDate, "days");
  };

  const toggleListModal = () => {
    setShowListVisible(!showListVisible);
  };

  const DeleteLongPress = (screenList) => {
    Alert.alert(SERIOUSLY_DELETE_LIST, "", [
      {
        text: CANCEL,
        onPress: () => null,
      },
      {
        text: DELETE,
        onPress: deleteList.bind(this, screenList),
      },
    ]);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        visible={showListVisible}
        onRequestClose={toggleListModal}
      >
        <TodoModal
          screenList={screenList}
          closeModal={toggleListModal}
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
                remainingDay() < 4
                  ? "red"
                  : mode === LIGHT_MODE
                  ? colors.blackColor
                  : colors.whiteColor,
            },
          ]}
        >
          {remainingDay() === 0
            ? `D-Day!!`
            : remainingDay() > 0
            ? `D-${remainingDay()}`
            : `D+${Math.abs(remainingDay())}`}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.screenListContainer,
          { backgroundColor: screenList.color },
        ]}
        onPress={toggleListModal}
        onLongPress={() => {
          Alert.alert(WHAT_WANT, "", [
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
              onPress: DeleteLongPress.bind(this, screenList),
            },
          ]);
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
};

const styles = StyleSheet.create({
  screenListContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    alignItems: "center",
    width: 200,
  },
  screenListTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.whiteColor,
    marginBottom: 18,
  },
  count: {
    fontSize: 48,
    fontWeight: "200",
    color: colors.whiteColor,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.whiteColor,
  },
  remainingContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    alignItems: "center",
    width: 200,
    marginBottom: 12,
  },
  remainingTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
});
