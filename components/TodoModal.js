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
import { ALERT_ALREADY_EXISTS, ALERT_BLANK_TODO } from "../words";

export default ({ screenList, closeModal, updateList, remainingDay }) => {
  const [newTodo, setNewTodo] = useState("");
  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const toggleTodoCompleted = (index) => {
    screenList.todos[index].completed = !screenList.todos[index].completed;
    updateList(screenList);
  };

  const addTodo = () => {
    const blankRegex = /^\s*$/;

    if (screenList.todos.filter((todo) => todo.title === newTodo).length > 0) {
      Alert.alert(ALERT_ALREADY_EXISTS);
    } else if (blankRegex.test(newTodo)) {
      Alert.alert(ALERT_BLANK_TODO);
    } else {
      screenList.todos.push({
        title: newTodo,
        completed: false,
      });
      updateList(screenList);
    }

    setNewTodo("");
    Keyboard.dismiss();
  };

  const editTodo = (title, index) => {
    setEdit(true);
    setNewTodo(title);
    setEditTitle(title);
    setEditIndex(index);
  };

  const submitEditTodo = () => {
    const blankRegex = /^\s*$/;

    if (
      screenList.todos.filter(
        (todo) => todo.title === newTodo && todo.title !== editTitle
      ).length > 0
    ) {
      Alert.alert(ALERT_ALREADY_EXISTS);
    } else if (blankRegex.test(newTodo)) {
      Alert.alert(ALERT_BLANK_TODO);
    } else {
      screenList.todos[editIndex] = {
        ...screenList.todos[editIndex],
        title: newTodo,
      };
      updateList(screenList);
    }

    setNewTodo("");
    setEdit(false);
    Keyboard.dismiss();
  };

  const deleteTodo = (title) => {
    screenList.todos = screenList.todos.filter((todo) => todo.title !== title);
    updateList(screenList);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}>
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
            <Text style={styles.title} numberOfLines={2}>
              {screenList.name}
            </Text>
            <Text style={styles.remainingCount}>
              {remainingDay() === 0
                ? `D-Day!!`
                : remainingDay() > 0
                ? `D-${remainingDay()}`
                : `D+${Math.abs(remainingDay())}`}
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
                editTodo={editTodo}
                deleteTodo={deleteTodo}
                edit={edit}
                newTodo={newTodo}
                editIndex={editIndex}
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
            onSubmitEditing={edit ? submitEditTodo : addTodo}
            autoCorrect={false}
            returnKeyType={"done"}
          />
          <TouchableOpacity
            style={[styles.addTodo, { backgroundColor: screenList.color }]}
            onPress={edit ? submitEditTodo : addTodo}
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
  remainingCount: {
    fontSize: 20,
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
