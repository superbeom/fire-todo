import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles";

export default ({ todo, index, toggleTodoCompleted }) => {
  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Revise
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
      <RectButton style={[styles.rightAction, { backgroundColor: "red" }]}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <Animated.Text style={styles.actionText}>Delete</Animated.Text>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <View style={styles.todoContainer}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={toggleTodoCompleted.bind(this, index)}
        >
          <Ionicons
            name={todo.completed ? "ios-square" : "ios-square-outline"}
            size={24}
            color={colors.grayColor}
            style={{ width: 32 }}
          />
          <Text
            style={[
              styles.todo,
              {
                textDecorationLine: todo.completed ? "line-through" : "none",
                color: todo.completed ? colors.grayColor : colors.blackColor,
              },
            ]}
          >
            {todo.title}
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
    fontSize: 16,
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
