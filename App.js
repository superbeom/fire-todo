import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "./styles";
import { APP_NAME, ADD_LIST, LIGHT_MODE, DARK_MODE } from "./words";
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";
import { randomKeyOne } from "./key";
import moment from "moment";
import { AdMobBanner } from "expo-ads-admob";

let COUNT = 0;
let CHECK_INDEX = 0;

export default App = () => {
  const newDate = new Date();
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [screenLists, setScreenLists] = useState([]);
  const [revise, setRevise] = useState(false);
  const [reviseScreenList, setReviseScreenList] = useState({});
  const [reviseKey, setReviseKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(newDate);
  const [selectDate, setSelectDate] = useState(newDate);
  const [goalTotalDate, setGoalTotalDate] = useState(null);
  const [goalYear, setGoalYear] = useState(null);
  const [goalMonth, setGoalMonth] = useState(null);
  const [goalDate, setGoalDate] = useState(null);
  const [getTime, setGetTime] = useState(null);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState(null);

  const toggleMode = async () => {
    setMode(mode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE);
    await AsyncStorage.setItem(
      "mode",
      mode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE
    );
  };

  const setReviseYearMonthDate = (time) => {
    /* 
      originDate - 이미 저장할 때 현지 시각(+09:00) 기준으로 저장돼서, 중복으로 또 더해지지 않도록
                 - splitDate를 위해.
    */
    const originDate = JSON.stringify(new Date(time)).substr(1, 24);

    /*
      Error 1 - Android - 'Value for value cannot be cast from String to Double'
      Error 2 - ios -  'value.getTime is not a function'
      Solution - Date.parse() 이용 - 왜인지는 모르겠는데,, 검색해 보니..
     */
    const parseDate = new Date(
      Date.parse(moment(time).format(`YYYY-MM-DDTHH:mm:ss.sssZ`))
    );
    const splitDate = originDate.split("-");
    const checkGetTime = new Date(parseDate).getTime();

    setGoalTotalDate(parseDate);
    setGoalYear(parseInt(splitDate[0]));
    setGoalMonth(parseInt(splitDate[1]));
    setGoalDate(parseInt(splitDate[2].substring(0, 2)));
    setSelectDate(parseDate);
    setGetTime(checkGetTime);

    return parseDate;
  };

  const setYearMonthDate = (time, detector) => {
    // 자동으로 현지 시각에 맞게 +09:00 추가 됨.
    const originDate = moment(time).format();
    const splitDate = originDate.split("-");
    const checkGetTime = new Date(originDate).getTime();
    /* Edit List 실행 시,
    DateTimePicker의 value 값이 아래와 같은 형식이어야 함 */
    const extractTime = originDate.split("+")[0];
    const combinateTime = extractTime + ".000Z";

    setGoalTotalDate(combinateTime);
    setGoalYear(parseInt(splitDate[0]));
    setGoalMonth(parseInt(splitDate[1]));
    setGoalDate(parseInt(splitDate[2].substring(0, 2)));
    setSelectDate(originDate);
    setGetTime(checkGetTime);
  };

  const nowOnChange = (event, selectedDate) => {
    const currentDate = selectedDate || now;
    setYearMonthDate(currentDate, "change");

    if (Platform.OS === "ios") {
      setNow(currentDate);
    } else if (Platform.OS === "android") {
      if (event.type === "set") {
        setNow(currentDate);
        setShow(false);
      } else if (event.type === "dismissed") {
        setShow(false);
      }
    }
  };

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
    setNow(newDate);
    setYearMonthDate(newDate, "initialize");
  };

  const closeReviseModal = () => {
    setRevise(false);
    toggleAddTodoModal();
  };

  const toggleReviseList = (screenList) => {
    setRevise(true);
    setNow(setReviseYearMonthDate(screenList.totalDate));
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
      totalDate: goalTotalDate,
      year: goalYear,
      month: goalMonth,
      date: goalDate,
      getTime: getTime,
    };

    setScreenLists((screenLists) => [...screenLists, newAddList]);
    await AsyncStorage.setItem(randomKeyOne[COUNT], JSON.stringify(newAddList));
    COUNT++;
    await AsyncStorage.setItem("count", COUNT.toString());
    setNow(newDate);
    setYearMonthDate(newDate, "initialize");
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
          totalDate: goalTotalDate,
          year: goalYear,
          month: goalMonth,
          date: goalDate,
          getTime: getTime,
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
    setNow(newDate);
    setYearMonthDate(newDate, "initialize");
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
      const storageMode = await AsyncStorage.getItem("mode");

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

      if (storageMode) {
        setMode(storageMode);
      } else {
        await AsyncStorage.setItem("mode", LIGHT_MODE);
      }

      setYearMonthDate(now, "initialize");
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
    <View
      style={{
        flex: 1,
        backgroundColor:
          mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor,
      }}
    >
      <StatusBar
        barStyle={mode === LIGHT_MODE ? "dark-content" : "light-content"}
        backgroundColor={
          mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor
        }
      />
      {Platform.OS === "ios" && (
        <TouchableOpacity
          style={{ width: 50, height: 50, zIndex: 5, top: 80, left: 20 }}
          onPress={toggleMode}
        >
          <Image
            style={{ width: 50, height: 50 }}
            source={
              mode === LIGHT_MODE
                ? require("./assets/moon.png")
                : require("./assets/sun.png")
            }
          />
        </TouchableOpacity>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor,
          },
        ]}
      >
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
            nowOnChange={nowOnChange}
            now={now}
            show={show}
            setShow={setShow}
            selectDate={selectDate}
            mode={mode}
          />
        </Modal>

        {Platform.OS === "ios" && (
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.title,
                {
                  color:
                    mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
                },
              ]}
            >
              {APP_NAME}
            </Text>
          </View>
        )}

        {Platform.OS === "android" && (
          <TouchableOpacity
            style={{ width: 50, height: 50, left: 130 }}
            onPress={toggleMode}
          >
            <Image
              style={{ width: 50, height: 50 }}
              source={
                mode === LIGHT_MODE
                  ? require("./assets/moon.png")
                  : require("./assets/sun.png")
              }
            />
          </TouchableOpacity>
        )}

        <View style={{ marginVertical: 48 }}>
          <TouchableOpacity
            style={[
              styles.addList,
              {
                color:
                  mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
                borderColor:
                  mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
              },
            ]}
            onPress={toggleAddTodoModal}
          >
            <AntDesign
              name={"plus"}
              size={16}
              color={
                mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor
              }
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.add,
              {
                color:
                  mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
              },
            ]}
          >
            {ADD_LIST}
          </Text>
        </View>

        <View style={{ height: 375, paddingLeft: 32 }}>
          <FlatList
            data={screenLists.sort((a, b) => {
              if (a.getTime > b.getTime) {
                return 1;
              } else if (a.getTime < b.getTime) {
                return -1;
              } else {
                return 0;
              }
            })}
            keyExtractor={(item) => item.key}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TodoList
                screenList={item}
                updateList={updateList}
                deleteList={deleteList}
                toggleReviseList={toggleReviseList}
                mode={mode}
              />
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>

        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-4979785113165927/8289125429"
          servePersonalizedAds={true}
          onDidFailToReceiveAdWithError={this.bannerError}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});
