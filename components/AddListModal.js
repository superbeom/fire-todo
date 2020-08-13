import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors, backgroundColors } from "../styles";
import RenderColor from "./RenderColor";
import {
  CREATE,
  EDIT,
  ALERT_BLANK_LIST,
  ALERT_ALREADY_EXISTS,
  CREATE_TODO_LIST,
  EDIT_TODO_LIST,
  TODO_LIST_NAME,
  LIGHT_MODE,
} from "../words";
import IosDatePicker from "./IosDatePicker";
import AndroidDatePicker from "./AndroidDatePicker";

export default ({
  closeModal,
  addList,
  screenLists,
  revise,
  closeReviseModal,
  reviseList,
  reviseScreenList,
  nowOnChange,
  now,
  show,
  setShow,
  selectDate,
  mode,
}) => {
  const [name, setName] = useState(revise ? reviseScreenList.name : "");
  const [borderColor, setBorderColor] = useState(
    revise ? reviseScreenList.color : backgroundColors[0]
  );
  const [color, setColor] = useState(
    revise ? reviseScreenList.color : backgroundColors[0]
  );

  const createTodo = () => {
    const blankRegex = /^\s*$/;

    if (blankRegex.test(name)) {
      Alert.alert(ALERT_BLANK_LIST);
    } else if (screenLists.filter((item) => item.name === name).length > 0) {
      Alert.alert(ALERT_ALREADY_EXISTS);
    } else {
      const screenList = { name, color };
      addList(screenList);
      closeModal();
    }
  };

  const reviseTodo = () => {
    const blankRegex = /^\s*$/;

    if (blankRegex.test(name)) {
      Alert.alert(ALERT_BLANK_LIST);
    } else if (
      screenLists.filter(
        (item) => item.name === name && item.name !== reviseScreenList.name
      ).length > 0
    ) {
      Alert.alert(ALERT_ALREADY_EXISTS);
    } else {
      const screenList = { name, color };
      reviseList(screenList);
      closeModal();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            backgroundColor:
              mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor,
          },
        ]}
        behavior={"height"}
      >
        <TouchableOpacity
          style={{ position: "absolute", top: 64, right: 32, zIndex: 5 }}
          onPress={revise ? closeReviseModal : closeModal}
        >
          <AntDesign
            name={"close"}
            size={34}
            color={mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor}
          />
        </TouchableOpacity>

        <View style={{ alignSelf: "stretch", marginHorizontal: 32, zIndex: 1 }}>
          <Text
            style={[
              styles.title,
              {
                color:
                  mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
              },
            ]}
          >
            {revise ? EDIT_TODO_LIST : CREATE_TODO_LIST}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: borderColor,
                color:
                  mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
              },
            ]}
            placeholder={TODO_LIST_NAME}
            placeholderTextColor={
              mode === LIGHT_MODE
                ? colors.lightPlaceholderTextColor
                : colors.darkPlaceholderTextColor
            }
            onChangeText={(text) => setName(text)}
            value={name}
            onSubmitEditing={revise ? reviseTodo : createTodo}
            autoCorrect={false}
            returnKeyType={"done"}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <RenderColor
              backgroundColors={backgroundColors}
              setBorderColor={setBorderColor}
              setColor={setColor}
            />
          </View>

          {Platform.OS === "ios" ? (
            <IosDatePicker
              color={color}
              nowOnChange={nowOnChange}
              now={now}
              mode={mode}
            />
          ) : (
            <AndroidDatePicker
              color={color}
              nowOnChange={nowOnChange}
              now={now}
              show={show}
              setShow={setShow}
              selectDate={selectDate}
              mode={mode}
            />
          )}

          <TouchableOpacity
            style={[styles.create, { backgroundColor: color }]}
            onPress={revise ? reviseTodo : createTodo}
          >
            <Text style={{ color: colors.whiteColor, fontWeight: "600" }}>
              {revise ? EDIT : CREATE}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    alignSelf: "center",
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    height: 50,
    marginTop: 36,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
