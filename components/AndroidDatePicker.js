import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";

export default ({
  color,
  nowOnChange,
  now,
  show,
  setShow,
  selectDate,
  mode,
}) => {
  const stringYear = moment(selectDate).format("YYYY");
  const stringMonth = moment(selectDate).format("MMMM");
  const stringDate = moment(selectDate).format("DD");

  return (
    <View
      style={{
        borderColor: color,
        borderWidth: 1,
        marginTop: 48,
        marginBottom: 24,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "600",
          marginTop: 5,
          marginBottom: 10,
          color: mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
        }}
      >
        Deadline
      </Text>
      <TouchableOpacity
        style={{ marginBottom: 15 }}
        onPress={() => setShow(true)}
      >
        <Text
          style={{
            fontSize: 24,
            color: mode === LIGHT_MODE ? colors.blackColor : colors.whiteColor,
          }}
        >
          {stringMonth} - {stringDate} - {stringYear}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={now}
          mode={"date"}
          display="default"
          onChange={nowOnChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};
