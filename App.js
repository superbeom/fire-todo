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

  const reviseList = (screenList) => {
    // const newReviseLists = screenLists.filter(async (item) => {
    //   if (item.index === reviseKey) {
    //     const newList = {
    //       ...item,
    //       ...screenList,
    //     };

    //     await AsyncStorage.setItem(
    //       randomKeyOne[reviseKey],
    //       JSON.stringify(newList)
    //     );

    //     return newList;
    //   } else {
    //     return item;
    //   }
    // });

    // setScreenLists((screenLists) => [...newReviseLists]);
    // setRevise(false);

    setScreenLists((screenLists) =>
      screenLists.filter(async (item) => {
        if (item.key === reviseKey) {
          const newList = {
            ...item,
            ...screenList,
          };

          await AsyncStorage.setItem(
            randomKeyOne[item.index],
            JSON.stringify(newList)
          );

          return newList;
        } else {
          return item;
        }
      })
    );

    setRevise(false);
  };

  const updateList = (screenList) => {
    setScreenLists((screenLists) =>
      screenLists.filter(async (item) => {
        if (item.key === screenList.key) {
          const updateIndex = screenList.index;
          await AsyncStorage.setItem(
            randomKeyOne[updateIndex],
            JSON.stringify(screenList)
          );
          return screenList;
        } else {
          return item;
        }
      })
    );
  };

  const deleteList = async (screenList) => {
    const newLists = screenLists.filter((item) => item.key !== screenList.key);
    setScreenLists((screenLists) => [...newLists]);
    await AsyncStorage.removeItem(randomKeyOne[screenList.index]);
  };

  const preLoad = async () => {
    try {
      // await AsyncStorage.clear();
      const storageCount = await AsyncStorage.getItem("count");
      if (storageCount) {
        COUNT = parseInt(storageCount);
        for (let i = 0; i < COUNT; i++) {
          const getList = await AsyncStorage.getItem(randomKeyOne[i]);
          console.log("getList: ", getList);
          if (getList !== null) {
            const userList = JSON.parse(getList);
            setScreenLists((screenLists) => [...screenLists, userList]);
          } else {
            console.log("getList is null. This index is ", i);
          }
        }
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
