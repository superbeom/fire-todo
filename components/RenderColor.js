import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default ({ backgroundColors, setBorderColor, setColor }) =>
  backgroundColors.map((backgroundColor) => (
    <TouchableOpacity
      key={backgroundColor}
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
