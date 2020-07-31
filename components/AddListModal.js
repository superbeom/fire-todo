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
} from "../words";

export default ({
  closeModal,
  addList,
  screenLists,
  revise,
  closeReviseModal,
  reviseList,
  reviseScreenList,
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
      <KeyboardAvoidingView style={styles.container} behavior={"height"}>
        <TouchableOpacity
          style={{ position: "absolute", top: 64, right: 32 }}
          onPress={revise ? closeReviseModal : closeModal}
        >
          <AntDesign name={"close"} size={34} color={colors.blackColor} />
        </TouchableOpacity>

        <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
          <Text style={styles.title}>
            {revise ? EDIT_TODO_LIST : CREATE_TODO_LIST}
          </Text>

          <TextInput
            style={[styles.input, { borderColor: borderColor }]}
            placeholder={TODO_LIST_NAME}
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
    color: colors.blackColor,
    alignSelf: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
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
