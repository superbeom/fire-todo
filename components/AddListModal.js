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
import tempData from "../tempData";

export default ({ closeModal }) => {
  const [name, setName] = useState("");
  const [borderColor, setBorderColor] = useState(backgroundColors[0]);
  const [color, setColor] = useState(backgroundColors[0]);

  const createTodo = () => {
    if (name === "") {
      Alert.alert("Write todo list name");
    } else {
      tempData.push({
        name,
        color,
        todos: [],
      });

      closeModal();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
        <TouchableOpacity
          style={{ position: "absolute", top: 64, right: 32 }}
          onPress={closeModal}
        >
          <AntDesign name={"close"} size={34} color={colors.blackColor} />
        </TouchableOpacity>

        <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
          <Text style={styles.title}>Create Todo List</Text>

          <TextInput
            style={[styles.input, { borderColor: borderColor }]}
            placeholder={"Todo List Name"}
            onChangeText={(text) => setName(text)}
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
            onPress={createTodo}
          >
            <Text style={{ color: colors.whiteColor, fontWeight: "600" }}>
              Creaste!
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
