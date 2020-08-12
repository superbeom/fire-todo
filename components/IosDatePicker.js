import React from "react";
import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";

export default ({ color, nowOnChange, now, mode }) => (
  <View
    style={{
      borderColor: color,
      borderWidth: 1,
      marginTop: 48,
      marginBottom: 24,
    }}
  >
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "600",
          color: mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
        }}
      >
        Deadline
      </Text>
    </View>
    <DateTimePicker
      testID="dateTimePicker"
      value={now}
      mode={"date"}
      is24Hour={true}
      display="default"
      onChange={nowOnChange}
      minimumDate={new Date()}
      textColor={mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor}
    />
  </View>
);
