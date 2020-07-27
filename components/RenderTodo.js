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
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colors } from "../styles";

export default ({
  todo,
  index,
  toggleTodoCompleted,
  editTodo,
  deleteTodo,
  update,
  newTodo,
  updateIndex,
}) => {
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
          style={{ flexDirection: "row", width: "100%" }}
          onPress={toggleTodoCompleted.bind(this, index)}
        >
          <MaterialCommunityIcons
            name={
              todo.completed
                ? "checkbox-marked-outline"
                : "checkbox-blank-outline"
            }
            size={24}
            color={todo.completed ? colors.grayColor : colors.blackColor}
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
            {update && index === updateIndex ? newTodo : todo.title}
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
