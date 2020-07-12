import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { colors } from "../styles";

export default ({ list, closeModal }) => {
  const [name, setName] = useState(list.name);
  const [color, setColor] = useState(list.color);
  const [todos, setTodos] = useState(list.todos);
  const taskCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  const renderTodo = (todo) => (
    <View style={styles.todoContainer}>
      <TouchableOpacity>
        <Ionicons
          name={todo.completed ? "ios-square" : "ios-square-outline"}
          size={24}
          color={colors.grayColor}
          style={{ width: 32 }}
        />
      </TouchableOpacity>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
        onPress={closeModal}
      >
        <AntDesign name={"close"} size={34} color={colors.blackColor} />
      </TouchableOpacity>

      <View
        style={[styles.section, styles.header, { borderBottomColor: color }]}
      >
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.taskCount}>
            {completedCount} of {taskCount} tasks
          </Text>
        </View>
      </View>

      <View style={[styles.section, { flex: 3 }]}>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => renderTodo(item)}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <KeyboardAvoidingView
        style={[styles.section, styles.footer]}
        behavior="padding"
      >
        <TextInput style={[styles.input, { borderColor: color }]} />
        <TouchableOpacity style={[styles.addTodo, { backgroundColor: color }]}>
          <AntDesign name={"plus"} size={16} color={colors.whiteColor} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    flex: 1,
    alignSelf: "stretch",
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.blackColor,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.grayColor,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    height: 48,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
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
