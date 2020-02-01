import React, { Component } from "react";
import { View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class DateTimePickerTester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <View style={{marginTop:50}}>
        <DateTimePicker
          isVisible={this.props.isDateTimePickerVisible}
          onConfirm={this.props.ConfirmDataTime}
          mode={'datetime'}
          onCancel={this.props.hideDateTimePicker}
        />
      </View>
    );
  }
}