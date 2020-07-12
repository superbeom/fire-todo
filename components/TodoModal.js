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
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../styles";
import RenderTodo from "./RenderTodo";

export default ({ list, closeModal, updateList }) => {
  const [newTodo, setNewTodo] = useState("");
  const taskCount = list.todos.length;
  const completedCount = list.todos.filter((todo) => todo.completed).length;

  const toggleTodoCompleted = (index) => {
    list.todos[index].completed = !list.todos[index].completed;
    updateList(list);
  };

  const addTodo = () => {
    list.todos.push({ title: newTodo, completed: false });
    updateList(list);
    setNewTodo("");
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
          onPress={closeModal}
        >
          <AntDesign name={"close"} size={34} color={colors.blackColor} />
        </TouchableOpacity>

        <View
          style={[
            styles.section,
            styles.header,
            { borderBottomColor: list.color },
          ]}
        >
          <View>
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount} tasks
            </Text>
          </View>
        </View>

        <View style={[styles.section, { flex: 3 }]}>
          <FlatList
            data={list.todos}
            keyExtractor={() => (Math.random() + Math.random()).toString()}
            renderItem={({ item, index }) => (
              <RenderTodo
                todo={item}
                index={index}
                toggleTodoCompleted={toggleTodoCompleted}
              />
            )}
            contentContainerStyle={{
              paddingHorizontal: 32,
              paddingVertical: 64,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={[styles.section, styles.footer]}>
          <TextInput
            style={[styles.input, { borderColor: list.color }]}
            onChangeText={(text) => setNewTodo(text)}
            value={newTodo}
          />
          <TouchableOpacity
            style={[styles.addTodo, { backgroundColor: list.color }]}
            onPress={addTodo}
          >
            <AntDesign name={"plus"} size={16} color={colors.whiteColor} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
});
