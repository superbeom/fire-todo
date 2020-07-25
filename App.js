import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "./styles";
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";
import { randomKeyOne } from "./key";

let COUNT = 0;
let CHECK_INDEX = 0;

export default App = () => {
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [screenLists, setScreenLists] = useState([]);
  const [revise, setRevise] = useState(false);
  const [reviseScreenList, setReviseScreenList] = useState({});
  const [reviseKey, setReviseKey] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  const closeReviseModal = () => {
    setRevise(false);
    toggleAddTodoModal();
  };

  const toggleReviseListName = (screenList) => {
    setRevise(true);
    setReviseScreenList(screenList);
    setReviseKey(screenList.key);
    setAddTodoVisible(!addTodoVisible);
  };

  const addList = async (screenList) => {
    const newAddList = {
      ...screenList,
      key: (Math.random() + Math.random()).toString(),
      todos: [],
      index: COUNT,
    };

    setScreenLists((screenLists) => [...screenLists, newAddList]);
    await AsyncStorage.setItem(randomKeyOne[COUNT], JSON.stringify(newAddList));
    COUNT++;
    await AsyncStorage.setItem("count", COUNT.toString());
  };

  const reviseList = async (screenList) => {
    let tempList = [];
    let tempIndex = null;
    let tempNewList = {};

    screenLists.forEach((item) => {
      if (item.key === reviseKey) {
        const newList = {
          ...item,
          ...screenList,
        };

        tempIndex = item.index;
        tempNewList = newList;
        tempList.push(newList);
      } else {
        tempList.push(item);
      }
    });

    await AsyncStorage.setItem(
      randomKeyOne[tempIndex],
      JSON.stringify(tempNewList)
    );

    setScreenLists((screenLists) => [...tempList]);
    setRevise(false);
  };

  const updateList = (screenList) => {
    setScreenLists((screenLists) =>
      screenLists.filter(async (item) => {
        if (item.key === screenList.key) {
          const newIndex = screenList.index;
          await AsyncStorage.setItem(
            randomKeyOne[newIndex],
            JSON.stringify(screenList)
          );
          // return screenList;
        } else {
          // return item;
        }
      })
    );
  };

  const deleteList = async (screenList) => {
    const newLists = screenLists.filter((item) => item.key !== screenList.key);
    setScreenLists((screenLists) => [...newLists]);
    await AsyncStorage.removeItem(randomKeyOne[screenList.index]);
  };

  const updateIndex = async (userList, index) => {
    const newIndex = index - CHECK_INDEX;
    const newUpdateList = {
      ...userList,
      index: newIndex,
    };
    await AsyncStorage.removeItem(randomKeyOne[index]);
    await AsyncStorage.setItem(
      randomKeyOne[newIndex],
      JSON.stringify(newUpdateList)
    );

    return newUpdateList;
  };

  const preLoad = async () => {
    try {
      // await AsyncStorage.clear();
      const storageCount = await AsyncStorage.getItem("count");
      if (storageCount) {
        COUNT = parseInt(storageCount);

        for (let i = 0; i < COUNT; i++) {
          const getList = await AsyncStorage.getItem(randomKeyOne[i]);
          if (getList !== null) {
            const userList = JSON.parse(getList);
            const updateUserList = await updateIndex(userList, i);
            setScreenLists((screenLists) => [...screenLists, updateUserList]);
          } else {
            CHECK_INDEX++;
            await AsyncStorage.removeItem(randomKeyOne[i]);
          }
        }

        COUNT = COUNT - CHECK_INDEX;
        await AsyncStorage.setItem("count", COUNT.toString());
      } else {
        await AsyncStorage.setItem("count", "0");
      }

      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    preLoad();
  }, []);

  return loading ? (
    <ActivityIndicator
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      size={"large"}
      color={colors.lightBlueColor}
    />
  ) : (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={addTodoVisible}
        onRequestClose={toggleAddTodoModal}
      >
        <AddListModal
          closeModal={toggleAddTodoModal}
          addList={addList}
          screenLists={screenLists}
          revise={revise}
          closeReviseModal={closeReviseModal}
          reviseList={reviseList}
          reviseScreenList={reviseScreenList}
        />
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
          data={screenLists}
          keyExtractor={(item) => item.key}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TodoList
              screenList={item}
              updateList={updateList}
              deleteList={deleteList}
              toggleReviseListName={toggleReviseListName}
            />
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
