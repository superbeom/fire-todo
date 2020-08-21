import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { colors } from "../styles";
import { LIGHT_MODE } from "../words";
import moment from "moment";

// export default ({ route }) => {
// const { mode } = route.params;
export default class Calendara extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          // marginTop: 150,
          // backgroundColor:
          //   mode === LIGHT_MODE ? colors.whiteColor : colors.blackColor,
        }}
      >
        <View style={{ flex: 0.6 }}></View>
        <View style={{ flex: 12 }}>
          {/* <Agenda
          current={new Date()}
          minDate={new Date()}
          loadItemsForMonth={(month) => {
            console.log("month: ", month);
          }}
          // items={{
          //   "2020-08-22": [{ name: "item 1 - any js object" }],
          //   "2020-08-23": [{ name: "item 2 - any js object", height: 80 }],
          //   "2020-08-24": [],
          //   "2020-08-25": [
          //     { name: "item 3 - any js object" },
          //     { name: "any js object" },
          //   ],
          // }}
        /> */}
          <Agenda
            current={moment().format()}
            minDate={moment().format()}
            items={this.state.items}
            loadItemsForMonth={this.loadItems.bind(this)}
            renderItem={this.renderItem.bind(this)}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            rowHasChanged={this.rowHasChanged.bind(this)}
            // markingType={'period'}
            // markedDates={{
            //    '2017-05-08': {textColor: '#43515c'},
            //    '2017-05-09': {textColor: '#43515c'},
            //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
            //    '2017-05-21': {startingDay: true, color: 'blue'},
            //    '2017-05-22': {endingDay: true, color: 'gray'},
            //    '2017-05-24': {startingDay: true, color: 'gray'},
            //    '2017-05-25': {color: 'gray'},
            //    '2017-05-26': {endingDay: true, color: 'gray'}}}
            // monthFormat={'yyyy'}
            // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
            //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
            // hideExtraDays={false}
          />
        </View>
      </View>
    );
  }

  loadItems(day) {
    setTimeout(() => {
      // for (let i = -15; i < 85; i++) {
      for (let i = 0; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          // for (let j = 0; j < numItems; j++) {
          //   this.state.items[strTime].push({
          //     name: "Item for " + strTime + " #" + j,
          //     height: Math.max(50, Math.floor(Math.random() * 150)),
          //   });
          // }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach((key) => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems,
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: item.height }]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>+</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }
}

const styles = StyleSheet.create({
  calendar: {},
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});
