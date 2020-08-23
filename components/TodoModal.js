import React, { PureComponent } from "react";
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
import { ALERT_ALREADY_EXISTS, ALERT_BLANK_TODO, LIGHT_MODE } from "../words";

class TodoModal extends PureComponent {
  state = {
    newTodo: "",
    edit: false,
    editTitle: null,
    editIndex: null,
  };

  toggleTodoCompleted = (screenList, updateList, index) => {
    screenList.todos[index].completed = !screenList.todos[index].completed;
    updateList(screenList);
  };

  addTodo = (newTodo, screenList, updateList) => {
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

    this.setState({ newTodo: "" });
  };

  editTodo = (title, index) => {
    this.setState({
      edit: true,
      newTodo: title,
      editTitle: title,
      editIndex: index,
    });
  };

  submitEditTodo = (newTodo, editTitle, editIndex, screenList, updateList) => {
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

    this.setState({
      newTodo: "",
      edit: false,
    });
    Keyboard.dismiss();
  };

  deleteTodo = (title, screenList, updateList) => {
    screenList.todos = screenList.todos.filter((todo) => todo.title !== title);
    updateList(screenList);
  };

  render() {
    const { newTodo, edit, editTitle, editIndex } = this.state;
    const {
      screenList,
      closeModal,
      updateList,
      remainingDay,
      mode,
    } = this.props;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}>
        <SafeAreaView
          style={[
            styles.container,
            {
              backgroundColor:
                mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor,
            },
          ]}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 48, right: 32, zIndex: 10 }}
            onPress={closeModal}
          >
            <AntDesign
              name={"close"}
              size={34}
              color={
                mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor
              }
            />
          </TouchableOpacity>

          <View
            style={[
              styles.section,
              styles.header,
              { borderBottomColor: screenList.color },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    color:
                      mode === LIGHT_MODE
                        ? colors.blackColor
                        : colors.whiteColor,
                  },
                ]}
                numberOfLines={2}
              >
                {screenList.name}
              </Text>
              <Text style={styles.remainingCount}>
                {remainingDay === 0
                  ? `D-Day!!`
                  : remainingDay > 0
                  ? `D-${remainingDay}`
                  : `D+${Math.abs(remainingDay)}`}
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
                  toggleTodoCompleted={this.toggleTodoCompleted}
                  editTodo={this.editTodo}
                  deleteTodo={this.deleteTodo}
                  screenList={screenList}
                  updateList={updateList}
                  edit={edit}
                  newTodo={newTodo}
                  editIndex={editIndex}
                  mode={mode}
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
              style={[
                styles.input,
                {
                  borderColor: screenList.color,
                  color:
                    mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
                },
              ]}
              onChangeText={(text) => this.setState({ newTodo: text })}
              value={newTodo}
              onSubmitEditing={
                edit
                  ? this.submitEditTodo.bind(
                      this,
                      newTodo,
                      editTitle,
                      editIndex,
                      screenList,
                      updateList
                    )
                  : this.addTodo.bind(this, newTodo, screenList, updateList)
              }
              autoCorrect={false}
              returnKeyType={"done"}
            />
            <TouchableOpacity
              style={[styles.addTodo, { backgroundColor: screenList.color }]}
              onPress={
                edit
                  ? this.submitEditTodo.bind(
                      this,
                      newTodo,
                      editTitle,
                      editIndex,
                      screenList,
                      updateList
                    )
                  : this.addTodo.bind(this, newTodo, screenList, updateList)
              }
            >
              <AntDesign name={"plus"} size={16} color={colors.whiteColor} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

export default TodoModal;

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
