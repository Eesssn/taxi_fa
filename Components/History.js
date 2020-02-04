import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  TextInput
} from "react-native";
import Axios from "axios";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";
import TopBar from "./TopBar";
import RideItem from "./RideItem";

class Ride extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Page: "main",
      temp: null,
      isDateTimePickerVisible: false,
      date: null,
      date2: null,
      NewHistory: null,
      date3: null,
      dateP: new Date()
    };
  }
  componentDidMount() {
    let dateTime = new Date();
    this.setState({
      date: moment(dateTime).format("MM DD YYYY"),
      date2: dateTime
    });
  }
  componentWillMount() {}
  handleDatePicked = date => {
    this.setState({
      date:
        date.getDate().toString() +
        " " +
        (date.getMonth() + +1) +
        " " +
        date.getFullYear().toString(),
      date3:
        date.getFullYear().toString() +
        "-" +
        date.getMonth().toString() +
        "-" +
        date.getDate().toString(),
      date2: date
    });
    var that = this;
    Axios.post("passenger/trips", {
      passenger_id: that.props.PassengerId,
      token: that.props.Token,
      // filter: 'today' || 'week' || 'month' || 'last_month'
      // min_date : that.state.date3,
      date: that.state.date2
      // max_date: that.state.date3
    })
      .then(function(response) {
        if (response.data.is_successful) {
          that.setState({
            NewHistory: response.data.data
          });
          that.hideDateTimePicker();
        } else {
          alert(response.data.message);
          that.hideDateTimePicker();
        }
      })
      .catch(function(err) {
        that.hideDateTimePicker();
      });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  selector = item => {
    this.setState({
      temp: item,
      Page: "Detail"
    });
  };
  renderRegisterType = () => {
    if (this.state.temp.info.payment_type_id === 1) {
      return "آنلاین";
    } else if (this.state.temp.info.payment_type_id === 2) {
      return "نقد";
    } else if (this.state.temp.info.payment_type_id === 3) {
      return "Incident";
    } else {
        return "نامشخص"
    }
  };
  render() {
    switch (this.state.Page) {
      case "Detail":
        console.log(this.state.temp);
        return (
          <View>
            <TopBar
              title="جزئیات سفر"
              leftIcon="back"
              ShowMenu={() => this.setState({ Page: "main" })}
            />
            <ScrollView>
              <View style={styles.Card}>
                <View style={styles.Section}>
                  <View style={styles.Row}>
                    <Image
                      source={
                        this.state.temp.driver.image_url === null
                          ? require("../assets/profile.png")
                          : { uri: this.state.temp.driver.image_url }
                      }
                      style={styles.DriverImage}
                    />
                    <Text style={[styles.DriverName, { fontFamily: "Medium" }]}>
                      {this.state.temp.driver.full_name}
                    </Text>
                  </View>
                </View>
                <View style={styles.Section}>
                  <View style={styles.Row}>
                    <Text style={[styles.Title, { fontFamily: "Medium" }]}>
                      مسافت طی شده{this.state.temp.info.distance} کیلومتر
                    </Text>
                    <Text style={[styles.Title, { fontFamily: "Medium" }]}>
                      {this.state.temp.created_at}
                    </Text>
                  </View>
                  <View style={styles.Row}>
                    <Text style={[styles.Title, { fontFamily: "Medium" }]}>
                      نحوه پرداخت : {this.renderRegisterType()}
                    </Text>
                    <Text style={[styles.Title, { fontFamily: "Medium" }]}>
                      مدت سفر : {this.state.temp.info.duration} دقیقه
                    </Text>
                  </View>
                  <View style={styles.Row}>
                    <Text style={[styles.Title, { fontFamily: "Medium" }]}>
                      شناسه سفر: {this.state.temp.code}
                    </Text>
                  </View>
                </View>
                <View style={styles.Section}>
                  <View style={styles.Row}>
                    <Image
                      source={require("../assets/start.png")}
                      style={styles.Icon}
                    />
                    <Text style={{ fontFamily: "Medium" }}>
                      {this.state.temp.info.from_address}
                    </Text>
                  </View>
                  <View style={styles.Row}>
                    <Image
                      source={require("../assets/target.png")}
                      style={styles.Icon}
                    />
                    <Text style={{ fontFamily: "Medium" }}>
                      {this.state.temp.info.to_address}
                    </Text>
                  </View>
                </View>
                <View style={styles.Section}>
                  <View style={styles.Row}>
                    <Text style={[styles.Text, { fontFamily: "Medium" }]}>
                      تاریخ: {this.state.temp.created_at}
                    </Text>
                  </View>
                  <View style={styles.Row}>
                    <Text style={[styles.Text, { fontFamily: "Medium" }]}>
                      هزینه سفر: {this.state.temp.info.price} تومان
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        );
        break;
      default:
        return (
          <View style={{ height: height }}>
            <TopBar
              title="تاریخچه سفر"
              leftIcon="back"
              ShowMenu={this.props.ShowMenu}
            />
            <View>
              <TouchableOpacity
                style={styles.DatePickerBtn}
                onPress={() => this.setState({ isDateTimePickerVisible: true })}
              >
                <Text style={{ fontFamily: "Medium" }}>تغییر تاریخ</Text>
                <Text style={{ fontFamily: "Medium" }}>{this.state.date}</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                is24Hour={false}
                mode="date"
                date={this.state.date2}
              />
            </View>
            <ScrollView>
              <RideItem
                data={
                  this.state.NewHistory !== null
                    ? this.state.NewHistory
                    : this.props.Trips
                }
                selected={this.state.temp}
                click={item => this.selector(item)}
              />
            </ScrollView>
          </View>
        );
        break;
    }
  }
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  Text: {
    textAlign: "center",
    fontSize: 14,
  },
  SenderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: -25,
    right: -25
  },
  MessageContainer: {
    backgroundColor: "#ffffff",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    width: (width / 100) * 85,
    padding: 20,
    margin: 30,
    marginLeft: (width / 100) * 7.5
  },
  MessageText: {},
  Card: {
    width: (width / 100) * 90,
    borderRadius: 10,
    marginLeft: (width / 100) * 5,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    marginBottom: 50,
    elevation: 6,
    backgroundColor: "#ffffff"
  },
  Section: {
    borderBottomColor: "#707070",
    borderBottomWidth: 0.5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginHorizontal: 10
  },
  Row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: (width / 100) * 90,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5
  },
  DriverImage: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  DriverName: {
    fontSize: 18,
  },
  Header: {
    fontSize: 14,
    color: "#ffffff"
  },
  SendMessageBtn: {
    backgroundColor: "#2a2e43",
    padding: 15,
    borderRadius: 30
  },
  Title: {
    fontSize: 14,
  },
  Icon: {
    width: 20,
    height: 20
  },
  DatePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: (width / 100) * 80,
    marginHorizontal: width / 10,
    marginTop: 12,
    borderColor: "#707070",
    borderWidth: 0.2,
    borderRadius: 10
  },
  TextInputStyle: {
    backgroundColor: "#ffffff",
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopColor: "#707070",
    borderTopWidth: 0.5
  }
});
export default Ride;
