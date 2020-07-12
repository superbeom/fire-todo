import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "./styles";
import tempData from "./tempData";
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";

export default App = () => {
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [lists, setLists] = useState(tempData);

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  const addList = (list) => {
    setLists((lists) => [
      ...lists,
      { ...list, key: (Math.random() + Math.random()).toString(), todos: [] },
    ]);
  };

  const updateList = (list) => {
    setLists((lists) =>
      lists.map((item) => (item.key === list.key ? list : item))
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={addTodoVisible}
        onRequestClose={toggleAddTodoModal}
      >
        <AddListModal closeModal={toggleAddTodoModal} addList={addList} />
      </Modal>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.divider} />
        <Text style={styles.title}>
          Todo{" "}
          <Text style={{ fontWeight: "300", color: colors.blueColor }}>
            Lists
          </Text>
        </Text>
        <View style={styles.divider} />
      </View>

      <View style={{ marginVertical: 48 }}>
        <TouchableOpacity style={styles.addList} onPress={toggleAddTodoModal}>
          <AntDesign name={"plus"} size={16} color={colors.blueColor} />
        </TouchableOpacity>

        <Text style={styles.add}>Add List</Text>
      </View>

      <View style={{ height: 275, paddingLeft: 32 }}>
        <FlatList
          data={lists}
          keyExtractor={(item) => item.key}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TodoList list={item} updateList={updateList} />
          )}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    backgroundColor: colors.lightBlueColor,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.blackColor,
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlueColor,
    borderRadius: 4,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    color: colors.blueColor,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});
