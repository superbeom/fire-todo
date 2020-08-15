import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colors } from "../styles";
import { LIGHT_MODE, CANCEL, EDIT, DELETE, EDIT_OR_DELETE } from "../words";

export default ({
  todo,
  index,
  toggleTodoCompleted,
  editTodo,
  deleteTodo,
  edit,
  newTodo,
  editIndex,
  mode,
}) => {
  const todoItemLongPress = (title, index) => {
    Alert.alert(
      EDIT_OR_DELETE,
      "",
      [
        {
          text: CANCEL,
          onPress: () => null,
        },
        {
          text: EDIT,
          onPress: editTodo.bind(this, title, index),
        },
        {
          text: DELETE,
          onPress: deleteTodo.bind(this, title),
        },
      ],
      /*
        Alert 띄웠을 때 - 뒤로가기 버튼으로 Alert를 끄려면,
        4번째 parameter에 { cancelable: true } 설정
      */
      { cancelable: true }
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <MaterialIcons
            name={"edit"}
            size={30}
            color={colors.whiteColor}
            style={{ width: 32 }}
          />
        </Animated.Text>
      </RectButton>
    );
  };

  const renderRightActions = (progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });
    return (
      <RectButton style={styles.rightAction}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <Animated.Text style={styles.actionText}>
            <FontAwesome
              name={"trash"}
              size={30}
              color={colors.whiteColor}
              style={{ width: 32 }}
            />
          </Animated.Text>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={editTodo.bind(this, todo.title, index)}
      onSwipeableRightOpen={deleteTodo.bind(this, todo.title)}
    >
      <View style={styles.todoContainer}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={toggleTodoCompleted.bind(this, index)}
          onLongPress={
            Platform.OS === "android" &&
            todoItemLongPress.bind(this, todo.title, index)
          }
        >
          <MaterialCommunityIcons
            name={
              todo.completed
                ? "checkbox-marked-outline"
                : "checkbox-blank-outline"
            }
            size={24}
            color={
              todo.completed
                ? colors.grayColor
                : mode === LIGHT_MODE
                ? colors.blackColor
                : colors.whiteColor
            }
            style={{ width: 32 }}
          />
          <Text
            style={[
              styles.todo,
              {
                textDecorationLine: todo.completed ? "line-through" : "none",
                color: todo.completed
                  ? colors.grayColor
                  : mode === LIGHT_MODE
                  ? colors.blackColor
                  : colors.whiteColor,
              },
            ]}
          >
            {edit && index === editIndex ? newTodo : todo.title}
          </Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  todo: {
    color: colors.blackColor,
    fontWeight: "700",
    fontSize: 18,
  },
  leftAction: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
  },
  rightAction: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    backgroundColor: "transparent",
    padding: 10,
  },
});
