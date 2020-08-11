import React from "react";
import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../styles";

export default ({ color, nowOnChange, now }) => (
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
        style={{ fontSize: 24, fontWeight: "600", color: colors.blackColor }}
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
    />
  </View>
);
