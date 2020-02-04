import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  BackHandler
} from "react-native";
import TopBar from "./TopBar";
import StarRating from "react-native-star-rating";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");

class ShowDriver extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      Page: "main",
      starCount: null,
      messages: [],
      CancelFee: "",
      data: null
    };
  }
  componentWillMount() {
    if (this.props.oldData !== null) {
      this.setState({
        data: this.state.oldData
      });
    } else {
      this.setState({
        data: this.props.Data
      });
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton
    );
    this.CheckCancel();
  }
  CheckCancel = () => {
    if (this.props.CancelCash !== null) {
      setTimeout(() => {
        this.setState({
          CancelFee: "5 CAD"
        });
      }, 90000);
    } else {
      setTimeout(() => {
        this.CheckCancel();
      }, 10000);
    }
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  handleBackButton = () => {
    if (this.state.Page == "chat") {
      this.setState({
        Page: "main"
      });
      return true;
    }
  };
  _Call = () => {
    Linking.openURL(
      `tel:${
        this.props.Data !== null
          ? this.props.Data.driver_phone_number
          : this.props.oldData.driver_phone_number
      }`
    );
  };
  render() {
    switch (this.state.Page) {
      case "chat":
        return (
          <View style={{ width: width, height: height, position: "relative" }}>
            <TopBar
              title="چت"
              leftIcon="back"
              ShowMenu={() => this.setState({ Page: "main" })}
            />
            <KeyboardAvoidingView enabled={true} behavior="position">
              <View style={styles.ChatContainer}>
                <View style={styles.MessagesContainer}>
                  <ScrollView>{this.props.renderMessage()}</ScrollView>
                </View>
                <View style={styles.BottomPageContainer}>
                  <TextInput
                    value={this.props.Message}
                    onChangeText={this.props.setMessage}
                    style={styles.TextInputStyle}
                    placeholder="پیام خود را بنویسید ..."
                    placeholderTextColor="#707070"
                    multiline={true}
                    numberOfLines={5}
                  />
                  {this.props.Message !== null ? (
                    <TouchableOpacity
                      style={styles.SendButton}
                      onPress={this.props.sendMessage}
                    >
                      <Text
                        style={[
                          styles.SendButtonText,
                          { fontFamily: "Medium" }
                        ]}
                      >
                        ارسال
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        );
        break;

      default:
        return (
          <View style={{ flex: 1 }}>
            <TopBar
              title={
                this.props.arrived
                  ? "راننده رسید و منتظر شماست"
                  : "راننده در راه است"
              }
              disable={true}
            />
            <MapView
              style={{ flex: 1 }}
              region={
                this.props.DriverLocation !== null
                  ? {
                      latitude:
                        this.props.DriverLocation !== null
                          ? parseFloat(this.props.DriverLocation.latitude)
                          : this.props.oldData !== null
                          ? parseFloat(this.props.oldData.driver_latitude)
                          : this.props.region.latitude,
                      longitude:
                        this.props.DriverLocation !== null
                          ? parseFloat(this.props.DriverLocation.longitude)
                          : this.props.oldData !== null
                          ? parseFloat(this.props.oldData.driver_longitude)
                          : this.props.region.longitude,
                      latitudeDelta: 0.004,
                      longitudeDelta: 0.004
                    }
                  : this.props.OriginCoordinates !== null
                  ? this.props.OriginCoordinates
                  : this.props.region
              }
            >
              {this.props.DriverLocation === null ? null : (
                <Marker
                  image={require("../assets/car2.png")}
                  style={{
                    width: 65,
                    height: 65,
                    zIndex: 200
                  }}
                  coordinate={{
                    latitude:
                      this.props.DriverLocation !== null
                        ? parseFloat(this.props.DriverLocation.latitude)
                        : this.props.oldData !== null
                        ? parseFloat(this.props.oldData.from_latitude)
                        : this.props.region.latitude,
                    longitude:
                      this.props.DriverLocation !== null
                        ? parseFloat(this.props.DriverLocation.longitude)
                        : this.props.oldData !== null
                        ? parseFloat(this.props.oldData.from_longitude)
                        : this.props.region.longitude
                  }}
                />
              )}
              <Marker
                image={require("../assets/OriginPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={
                  this.props.OriginCoordinates !== null
                    ? this.props.OriginCoordinates
                    : {
                        latitude: parseFloat(this.props.oldData.from_latitude),
                        longitude: parseFloat(this.props.oldData.from_longitude)
                      }
                }
              />
              <Marker
                image={require("../assets/DestinationPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={
                  this.props.DestinationCoordinates !== null
                    ? this.props.DestinationCoordinates
                    : {
                        latitude: parseFloat(this.props.oldData.to_latitude),
                        longitude: parseFloat(this.props.oldData.to_longitude)
                      }
                }
              />
            </MapView>
            <View style={styles.Container}>
              <View style={styles.headerRow}>
                <Image
                  source={{
                    uri:
                      this.props.Data !== null
                        ? this.props.Data.driver_image_url
                        : this.props.oldData.driver_image_url
                  }}
                  style={styles.driverimage}
                />
                <StarRating
                  disabled={true}
                  maxStars={5}
                  fullStarColor="#eeee00"
                  halfStarColor="#eeee00"
                  starSize={20}
                  rating={
                    this.props.Data !== null
                      ? this.props.Data.driver_rating.toString()
                      : this.props.oldData.driver_rating.toString()
                  }
                />
                <Text style={[styles.driverName, { fontFamily: "Medium" }]}>
                  {this.props.Data !== null
                    ? this.props.Data.driver_name
                    : this.props.oldData.driver_name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailColumn}>
                  <Text style={{ fontFamily: "Medium" }}>مدل ماشین</Text>
                  <Text style={{ fontFamily: "Medium" }}>
                    {this.props.Data !== null
                      ? this.props.Data.driver_car_brand +
                        " " +
                        this.props.Data.driver_car_model
                      : this.props.oldData.driver_car_brand +
                        " " +
                        this.props.oldData.driver_car_model}
                  </Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={{ fontFamily: "Medium" }}>رنگ ماشین</Text>
                  <Text style={{ fontFamily: "Medium" }}>
                    {this.props.Data !== null
                      ? this.props.Data.driver_car_color
                      : this.props.oldData.driver_car_color}
                  </Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={{ fontFamily: "Medium" }}>شماره پلاک</Text>
                  <Text style={{ fontFamily: "Medium" }}>
                    {this.props.Data !== null
                      ? this.props.Data.driver_car_number
                      : this.props.oldData.driver_car_number}
                  </Text>
                </View>
              </View>
              <View style={styles.Row}></View>
              <View style={styles.footerRow}>
                <TouchableOpacity
                  style={styles.whiteButton}
                  onPress={this.props.cancel}
                >
                  <Text
                    style={[styles.whiteButtonText, { fontFamily: "Medium" }]}
                  >
                    لغو سفر {this.state.CancelFee}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => this.setState({ Page: "chat" })}
                >
                  <Text
                    style={[styles.primaryButtonText, { fontFamily: "Medium" }]}
                  >
                    چت با راننده
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => this._Call()}
                >
                  <Text
                    style={[styles.primaryButtonText, { fontFamily: "Medium" }]}
                  >
                    تماس با راننده
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
        break;
    }
  }
}

const styles = StyleSheet.create({
  recieverMessage: {
    backgroundColor: "#e9e9e9",
    alignSelf: "flex-start",
    maxWidth: (width / 10) * 9,
    position: "relative",
    marginLeft: 5,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  senderMessage: {
    backgroundColor: "#2a2e43",
    alignSelf: "flex-end",
    maxWidth: (width / 10) * 9,
    marginRight: 5,
    position: "relative",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  Message: {
    marginRight: 40,
    marginBottom: 20,
    padding: 10
  },
  Message2: {
    marginRight: 40,
    marginBottom: 20,
    padding: 10,
    color: "#fff"
  },
  Date: {
    position: "absolute",
    bottom: 5,
    right: 10,
    fontSize: 11,
    fontWeight: "200"
  },
  Date2: {
    position: "absolute",
    bottom: 5,
    right: 10,
    fontSize: 11,
    fontFamily: "Medium",
    color: "#fff"
  },
  ChatContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: height - 70,
    backgroundColor: "white"
  },
  MessagesContainer: {
    height: height - 140,
    flexDirection: "column",
    justifyContent: "flex-end",
    width: width
  },
  BottomPageContainer: {
    borderTopColor: "#000",
    borderTopWidth: 1,
    flexDirection: "row",
    width: width,
    height: 70,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between"
  },
  TextInputStyle: {
    backgroundColor: "#f5f5f5",
    width: (width / 10) * 8.5,
    height: 70,
    paddingHorizontal: 10
  },
  SendButton: {
    width: (width / 10) * 1.5,
    height: 70,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  SendButtonText: {
    color: "#2a2e43",
    textAlign: "center",
    fontFamily: "Medium"
  },
  bottomPage: {
    paddingTop: 15,
    flex: 4,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#2A2E43",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  Row: {
    marginVertical: 10,
    width: width,
    alignItems: "center",
    justifyContent: "center"
  },
  chatBtn: {
    width: (width / 10) * 8,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    backgroundColor: "#2a2e43"
  },
  chatBtnTxt: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Medium",
    textAlign: "center"
  },
  Container: {
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 20
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-around"
  },
  driverimage: {
    width: width / 4,
    height: width / 4,
    borderRadius: width / 8,
    padding: 1,
    borderColor: "#000",
    borderWidth: 0.5
  },
  driverName: {
    fontSize: 14,
    fontFamily: "Medium"
  },
  detailRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around"
  },
  detailColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around"
  },
  footerRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  whiteButton: {
    borderColor: "#707070",
    borderWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5
  },
  whiteButtonText: {},
  primaryButton: {
    backgroundColor: "#2A2E43",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10,
    marginRight: 5,
    marginLeft: 5
  },
  primaryButtonText: {
    color: "#fff",
    fontFamily: "Medium"
  }
});

export default ShowDriver;
