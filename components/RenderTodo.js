import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles";

export default ({ todo, index, toggleTodoCompleted }) => {
  return (
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
});
