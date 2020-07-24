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
  Alert,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../styles";
import RenderTodo from "./RenderTodo";

export default ({ screenList, closeModal, updateList }) => {
  const [newTodo, setNewTodo] = useState("");
  const taskCount = screenList.todos.length;
  const completedCount = screenList.todos.filter((todo) => todo.completed)
    .length;

  const toggleTodoCompleted = (index) => {
    screenList.todos[index].completed = !screenList.todos[index].completed;
    updateList(screenList);
  };

  const addTodo = () => {
    const blankRegex = /^\s*$/;

    if (screenList.todos.filter((todo) => todo.title === newTodo).length > 0) {
      Alert.alert("Already exists");
    } else if (blankRegex.test(newTodo)) {
      Alert.alert("Write todo name");
    } else {
      screenList.todos.push({
        title: newTodo,
        completed: false,
      });
      console.log("TodoModal and screenList: ", screenList);
      updateList(screenList);
    }

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
            { borderBottomColor: screenList.color },
          ]}
        >
          <View>
            <Text style={styles.title}>{screenList.name}</Text>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount} tasks
            </Text>
          </View>
        </View>

        <View style={[styles.section, { flex: 3 }]}>
          <FlatList
            data={screenList.todos}
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
            style={[styles.input, { borderColor: screenList.color }]}
            onChangeText={(text) => setNewTodo(text)}
            value={newTodo}
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.addTodo, { backgroundColor: screenList.color }]}
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
