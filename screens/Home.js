import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
  Image,
  StatusBar,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { vw, vh, vmax } from "react-native-expo-viewport-units";
import { colors } from "../styles";
import { APP_NAME, ADD_LIST, LIGHT_MODE, DARK_MODE } from "../words";
import TodoList from "../components/TodoList";
import AddListModal from "../components/AddListModal";
import { randomKeyOne } from "../key";
import moment from "moment";
import { AdMobBanner } from "expo-ads-admob";
import Calendar from "./Calendar";

let COUNT = 0;
let CHECK_INDEX = 0;

export default React.memo(() => {
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
  const [mode, setMode] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendarModal = () => {
    setShowCalendar(!showCalendar);
  };

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

    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.whiteColor,
      }}
    >
      <Image
        style={{ width: 115, height: 115 }}
        source={require("../assets/icon.png")}
      />
    </View>
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
      <View style={{ flex: 0.7 }}></View>

      <View
        style={[
          styles.headerToggleMode,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.toggleModeContainer,
            {
              shadowColor:
                mode === LIGHT_MODE
                  ? colors.lightYellowColor
                  : colors.whiteColor,
            },
          ]}
          onPress={toggleMode}
        >
          <Image
            style={{ width: vmax(6), height: vmax(6), left: 10 }}
            source={
              mode === LIGHT_MODE
                ? require("../assets/sun.png")
                : require("../assets/moon.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: vmax(6), height: vmax(6), right: 10, zIndex: 5 }}
          onPress={() => setShowCalendar(true)}
        >
          <Image
            style={{ width: vmax(6), height: vmax(6), right: 10 }}
            source={
              mode === LIGHT_MODE
                ? require("../assets/lightCalendar.png")
                : require("../assets/darkCalendar.png")
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTitle}>
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

      <View style={styles.headerAdd}>
        <TouchableOpacity
          style={[
            styles.addListButton,
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
            color={mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.addListText,
            {
              color:
                mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
            },
          ]}
        >
          {ADD_LIST}
        </Text>
      </View>

      <View
        style={[
          styles.body,
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
            selectDate={selectDate}
            mode={mode}
          />
        </Modal>

        <Modal
          animationType="slide"
          visible={showCalendar}
          onRequestClose={toggleCalendarModal}
        >
          <Calendar
            mode={mode}
            screenLists={screenLists}
            updateList={updateList}
            toggleCalendarModal={toggleCalendarModal}
          />
        </Modal>

        <View
          style={[
            styles.flatListContainer,
            {
              shadowColor:
                mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
            },
          ]}
        >
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
      </View>
      <View style={styles.admob}>
        {Platform.OS === "ios" && (
          <AdMobBanner
            bannerSize="banner"
            adUnitID="ca-app-pub-8452350078553076/5057650368"
            servePersonalizedAds={true}
            onDidFailToReceiveAdWithError={this.bannerError}
          />
        )}
        {Platform.OS === "android" && (
          <AdMobBanner
            bannerSize="banner"
            adUnitID="ca-app-pub-8452350078553076/7140694702"
            servePersonalizedAds={true}
            onDidFailToReceiveAdWithError={this.bannerError}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerToggleMode: {
    flex: 1,
  },
  toggleModeContainer: {
    width: vmax(6),
    height: vmax(6),
    left: 10,
    zIndex: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.37,
    shadowRadius: 24,
    elevation: 12,
  },
  headerTitle: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  headerAdd: {
    marginTop: 20,
    alignItems: "center",
  },
  body: {
    flex: 11,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {
    fontSize: vw(9),
    fontWeight: "800",
    paddingHorizontal: 64,
  },
  addListButton: {
    width: vw(15),
    height: vw(15),
    borderWidth: 2,
    borderRadius: 4,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addListText: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
  flatListContainer: {
    height: vh(48),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  admob: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
