import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default ({ backgroundColors, setBorderColor, setColor }) =>
  backgroundColors.map((backgroundColor, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.colorSelect, { backgroundColor: backgroundColor }]}
      onPress={() => {
        setBorderColor(backgroundColor);
        setColor(backgroundColor);
      }}
    />
  ));

const styles = StyleSheet.create({
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
