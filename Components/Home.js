import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  ToastAndroid,
  TouchableWithoutFeedback,
  Clipboard,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Audio } from "expo-av";
import StarRating from "react-native-star-rating";
import moment from "moment";
import axios from "axios";
import { Notifications } from "expo";
import Pusher from "pusher-js/react-native";

import HomeViewNew from "./HomeView";
import TaxiArrived from "./TaxiArrived";
import AppLoadingScreen from "./Loading";
import CancelView from "./CancelView";
import ShowDriver from "./ShowDriver";
import CarDetail from "./CarDetail";
import TopBar from "./TopBar";
import registerForPushNotificationsAsync from "./PushFunctionality";
import Modal from "react-native-modal";
import { parse } from "react-native-svg";

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      e => reject(e)
    );
  });
};

const pusher = new Pusher("ea43a35aee157f8c9503", {
  cluster: "ap2",
  forceTLS: true
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voucherStatus: false,
      cancelBeforeAccept: false,
      arrived: false,
      mainCounter: 0,
      finishedCost: null,
      Page: "main",
      ShouldPlay: false,
      VoucherVal: "",
      counter: 1,
      arrivedModal: false,
      pickedUpModal: false,
      DriverLocation: null,
      notification: {},
      Token: null,
      passenger_id: null,
      promoStatus: null,
      Fullname: null,
      Phonenumber: null,
      Tip: null,
      removeFinalizeButton: false,
      Email: null,
      ImageUrl: null,
      Region: null,
      Region2: null,
      OriginCoordinates: null,
      voucherId: null,
      OriginName: null,
      DestinationName: null,
      oldData: null,
      DestinationCoordinates: null,
      DestinationCoordinatesFromSearch: null,
      Favorite: [],
      baseLat: null,
      baseLong: null,
      PageWithChat: [],
      starCount: 0,
      Note: null,
      DriverLocationInterval: [],
      NoteToDriver: null,
      Date: null,
      Time: null,
      FromAddress: null,
      ToAddress: null,
      selectedFav: null,
      TripIdFromServer: null,
      TripCodeFromServer: null,
      CancelCash: null,
      Cars: null,
      TempTaxiType: null,
      ValueTaxiType: 0,
      DriverAcceptedData: null,
      message: null,
      Message: null,
      Messages: [],
      ReferrerCode: null,
      MessageCopy: null,
      ReserveCodeFromServer: null,
      BaseFareEstimate: null,
      ReserveIdFromServer: null,
      taxis: null,
      CounterForAsync: 0
    };
  }
  componentWillMount() {
    this.FetchOldData();
  }
  async componentDidMount() {
    await soundObject.loadAsync(require("../assets/notification2.mp3"));
    await soundObject2.loadAsync(require("../assets/notification.mp3"));
    registerForPushNotificationsAsync();
    this.getFavorites();
    return getCurrentPosition().then(position => {
      if (position) {
        this.setState({
          Region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004
          },
          Region2: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004
          },
          baseLat: position.coords.latitude,
          baseLong: position.coords.longitude
        });
        this.SendLocationToRecieveDrivers();
      }
    });
  }
  FetchOldData = () => {
    if (this.state.mainCounter === 0) {
      setTimeout(() => {
        if (this.props.oldData !== null) {
          this.setState({
            mainCounter: 1
          });
          var that = this;
          if (this.props.oldData.trip_status === 6) {
            this.props.Status(false);
            this.setState({
              oldData: this.props.oldData,
              Page: "seat",
              mainCounter: 1
            });
            var channel = pusher.subscribe(
              `trip-passenger-${that.props.oldData.trip_id}`
            );
            channel.bind("payment-failed", function() {
              that.setState({
                Page: "payFailed"
              });
            });
            channel.bind("trip-canceled", function() {
              that._cancel();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("admin-trip-canceled", function() {
              that._cancelAdmin();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-paid", function(data) {
              that._FinishTrip(data);
              that.setState({
                mainCounter: 0,
                voucherStatus: false,
                TempTaxiType: null,
                ValueTaxiType: null
              });
            });
            channel.bind("trip-finished", function(data) {
              that._FinishTrip2(data);
            });
          }
          if (this.props.oldData.trip_status === 1) {
            this.setState({
              mainCounter: 1,
              Page: "loading"
            });
            this.props.Status(false);
            var channel = pusher.subscribe(
              `trip-passenger-${that.props.oldData.trip_id}`
            );
            channel.bind("driver-arrived", function() {
              that.PlaySound2();
              that.state.DriverLocationInterval.map(item => {
                clearInterval(item);
              });
              that.GetDriverLocation();
              that.setState({
                arrived: true,
                ShouldPlay: true,
                arrivedModal: true,
                CancelCash: "5 CAD"
              });
            });
            channel.bind("admin-trip-canceled", function() {
              that._cancelAdmin();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("driver-accepted", function(data) {
              that._DriverAccepted(data);
            });
            channel.bind("driver-is-near", function() {});
            channel.bind("driver-started-to-move", function() {
              that.PlaySound();
              that.StartToMove();
            });
            channel.bind("passenger-picked-up", function() {
              that._PickUp();
              that.setState({
                pickedUpModal: true
              });
            });
            channel.bind("payment-failed", function(data) {
              that.setState({
                Page: "payFailed"
              });
            });
            channel.bind("trip-canceled", function(data) {
              that._cancel();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-paid", function(data) {
              that._FinishTrip(data);
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-finished", function(data) {
              that._FinishTrip2(data);
            });
            channel.bind("new-message", function(data) {
              that.PlaySound();
              if (that.state.PageWithChat[0] !== "chat") {
                alert("New message");
              }
              var msg = data.message;
              that._PushMessage(msg);
            });
          }
          if (this.props.oldData.trip_status === 3) {
            this.setState({
              mainCounter: 1
            });
            this.props.Status(false);
            var channel = pusher.subscribe(
              `trip-passenger-${that.props.oldData.trip_id}`
            );
            channel.bind("driver-accepted", function(data) {
              that._DriverAccepted(data);
            });
            channel.bind("admin-trip-canceled", function() {
              that._cancelAdmin();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("driver-arrived", function() {
              that.PlaySound2();
              that.state.DriverLocationInterval.map(item => {
                clearInterval(item);
              });
              that.GetDriverLocation();
              that.setState({
                arrived: true,
                arrivedModal: true,
                ShouldPlay: true,
                CancelCash: "5 CAD"
              });
            });
            channel.bind("driver-is-near", function() {
              that.PlaySound();
              // that.setState({
              //     driverNearModal: true,
              // })
            });
            channel.bind("driver-started-to-move", function() {
              that.PlaySound();
              that.StartToMove();
            });
            channel.bind("passenger-picked-up", function() {
              that._PickUp();
              that.setState({
                pickedUpModal: true
              });
            });
            channel.bind("payment-failed", function(data) {
              that.setState({
                Page: "payFailed"
              });
            });
            channel.bind("trip-canceled", function(data) {
              that._cancel();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-paid", function(data) {
              that._FinishTrip(data);
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-finished", function(data) {
              that._FinishTrip2(data);
            });
            channel.bind("new-message", function(data) {
              that.PlaySound();
              if (that.state.PageWithChat[0] !== "chat") {
                alert("New message");
              }
              var msg = data.message;
              that._PushMessage(msg);
            });
            this.setState({
              Page: "start",
              oldData: this.props.oldData
            });
            this.GetDriverLocation();
          }
          if (this.props.oldData.trip_status === 4) {
            this.setState({
              mainCounter: 1
            });
            this.props.Status(false);
            var channel = pusher.subscribe(
              `trip-passenger-${that.props.oldData.trip_id}`
            );
            channel.bind("driver-arrived", function() {
              that.PlaySound2();
              that.state.DriverLocationInterval.map(item => {
                clearInterval(item);
              });
              that.GetDriverLocation();
              that.setState({
                arrived: true,
                arrivedModal: true,
                ShouldPlay: true,
                CancelCash: "5 CAD"
              });
            });
            channel.bind("driver-is-near", function() {
              that.PlaySound();
              // that.setState({
              //     driverNearModal: true,
              // })
            });
            channel.bind("admin-trip-canceled", function() {
              that._cancelAdmin();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("passenger-picked-up", function() {
              that._PickUp();
              that.setState({
                pickedUpModal: true
              });
            });
            channel.bind("payment-failed", function(data) {
              that.setState({
                Page: "payFailed"
              });
            });
            channel.bind("trip-canceled", function(data) {
              that._cancel();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-paid", function(data) {
              that._FinishTrip(data);
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-finished", function(data) {
              that._FinishTrip2(data);
            });
            channel.bind("new-message", function(data) {
              that.PlaySound();
              if (that.state.PageWithChat[0] !== "chat") {
                alert("New message");
              }
              var msg = data.message;
              that._PushMessage(msg);
            });
            this.setState({
              Page: "start",
              oldData: this.props.oldData
            });
            this.GetDriverLocation();
          }
          if (this.props.oldData.trip_status === 5) {
            this.setState({
              mainCounter: 1
            });
            this.props.Status(false);
            console.log("line 415");
            var channel = pusher.subscribe(
              `trip-passenger-${that.props.oldData.trip_id}`
            );
            channel.bind("driver-accepted", function(data) {
              that._DriverAccepted(data);
            });
            channel.bind("admin-trip-canceled", function() {
              that._cancelAdmin();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("driver-arrived", function() {
              that.PlaySound2();
              that.state.DriverLocationInterval.map(item => {
                clearInterval(item);
              });
              that.GetDriverLocation();
              that.setState({
                arrived: true,
                ShouldPlay: true,
                arrivedModal: true,
                CancelCash: "5 CAD"
              });
            });
            channel.bind("driver-is-near", function() {
              that.PlaySound();
              // that.setState({
              //     driverNearModal: true,
              // })
            });
            channel.bind("driver-started-to-move", function() {
              that.PlaySound();
              that.StartToMove();
            });
            channel.bind("passenger-picked-up", function() {
              that._PickUp();
              that.setState({
                pickedUpModal: true
              });
            });
            channel.bind("payment-failed", function(data) {
              that.setState({
                Page: "payFailed"
              });
            });
            channel.bind("trip-canceled", function(data) {
              that._cancel();
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-paid", function(data) {
              that._FinishTrip(data);
              that.setState({
                mainCounter: 0
              });
            });
            channel.bind("trip-finished", function(data) {
              that._FinishTrip2(data);
            });
            channel.bind("new-message", function(data) {
              that.PlaySound();
              if (that.state.PageWithChat[0] !== "chat") {
                alert("New message");
              }
              var msg = data.message;
              that._PushMessage(msg);
            });
            this.setState({
              Page: "start",
              oldData: this.props.oldData,
              CancelCash: "5 CAD"
            });
          }
        } else {
          this.getValuesFromAsync();
          if (this.state.mainCounter === 0) {
            setTimeout(() => {
              this.props.Status(true);
              this.FetchOldData();
            }, 15000);
          }
        }
      }, 1000);
    }
    if (this.state.mainCounter === 2) {
      this.props.Status(true);
      console.log("line 502");
    }
  };
  getValuesFromAsync = async () => {
    const token = await AsyncStorage.getItem("token");
    const phone_number = await AsyncStorage.getItem("phone");
    const passenger_id = await AsyncStorage.getItem("passenger_id");
    const image = await AsyncStorage.getItem("image");
    const name = await AsyncStorage.getItem("name");
    const email = await AsyncStorage.getItem("email");
    const referrerCode = await AsyncStorage.getItem("refferCode");
    this.setState({
      Token: token,
      ReferrerCode: referrerCode,
      passenger_id: passenger_id,
      Fullname: name,
      Email: email,
      ImageUrl: image,
      Phonenumber: phone_number,
      oldData: null,
      Page: "main"
    });
    if (this.state.Token === null) {
      setTimeout(() => {
        this.getValuesFromAsync();
      }, 1000);
    }
  };
  async PlaySound() {
    try {
      await soundObject2.playAsync();
    } catch (error) {}
  }
  async PlaySound2() {
    this.setState({
      ShouldPlay: true
    });
    try {
      await soundObject.playAsync();
      var inter = setInterval(async () => {
        if (!this.state.ShouldPlay) {
          await soundObject.stopAsync();
          clearInterval(inter);
        }
      }, 2000);
      setTimeout(() => {
        this.setState({
          ShouldPlay: false
        });
      }, 15000);
      await soundObject.setIsLoopingAsync(true);
    } catch (error) {}
  }
  async StopSound() {
    await soundObject.stopAsync();
    await soundObject2.stopAsync();
  }
  renderMessages = () => {
    let messages = [];
    this.state.Messages.map((item, i) => {
      messages.push(
        <TouchableWithoutFeedback
          key={i}
          onLongPress={() => this._CopyMessage(item.text)}
        >
          <View
            style={
              item.type === "receiver"
                ? styles.recieverMessage
                : styles.senderMessage
            }
          >
            <Text
              style={
                item.type === "receiver" ? styles.Message : styles.Message2
              }
            >
              {item.text}
            </Text>
            <Text
              style={
                item.type === "receiver" ? styles.Date : (D = styles.Date2)
              }
            >
              {item.date}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });

    return messages;
  };
  _CopyMessage = data => {
    ToastAndroid.show("Message copy to clipboard", ToastAndroid.SHORT);
    this.setState({
      MessageCopy: data
    });
    Clipboard.setString(data);
  };
  _SendMessage = () => {
    var that = this;
    let message = {
      text: this.state.Message,
      date: new Date().getHours() + ":" + new Date().getMinutes(),
      type: "sender"
    };
    axios
      .post("trip/message", {
        trip_id:
          that.state.TripIdFromServer !== null
            ? that.state.TripIdFromServer
            : that.props.oldData.trip_id,
        token: that.state.Token,
        passenger_id: that.state.passenger_id,
        message: that.state.Message
      })
      .then(function(response) {
        if (response.data.is_successful) {
          that.setState({
            Messages: [...that.state.Messages, message],
            Message: null
          });
        }
      })
      .catch(function(error) {});
  };
  _PushMessage = data => {
    let message = {
      text: data,
      date: new Date().getHours() + ":" + new Date().getMinutes(),
      type: "receiver"
    };
    this.PlaySound();
    this.setState({ Messages: [...this.state.Messages, message] });
  };
  SendLocationToRecieveDrivers = () => {
    if (this.state.Token !== null) {
      var that = this;
      axios
        .post("trip/drivers", {
          latitude: this.state.Region.latitude,
          longitude: this.state.Region.longitude,
          token: this.state.Token,
          passenger_id: this.state.passenger_id
        })
        .then(function(response) {
          if (response.data.is_successful) {
            that.setState({
              taxis: response.data.data
            });
          }
        })
        .catch(function(error) {});
    }
  };
  _StartTrip = () => {
    var thiss = this;
    console.log("trip_type_id: ", thiss.state.TempTaxiType.id);
    console.log("passenger_id: ", thiss.state.passenger_id);
    console.log("voucher_id:", thiss.state.voucherId);
    console.log("from_latitude: ", thiss.state.OriginCoordinates.latitude);
    console.log("from_longitude: ", thiss.state.OriginCoordinates.longitude);
    console.log("to_latitude: ", thiss.state.DestinationCoordinates.latitude);
    console.log("to_longitude: ", thiss.state.DestinationCoordinates.longitude);
    console.log("note: ", thiss.state.NoteToDriver);
    console.log("token: ", thiss.state.Token);
    console.log("price: ", thiss.state.TempTaxiType.price);
    console.log("distance: ", thiss.state.TempTaxiType.distance);
    console.log("duration: ", thiss.state.TempTaxiType.duration);
    console.log("to_address: ", thiss.state.ToAddress);
    console.log("from_address:", thiss.state.FromAddress);
    axios
      .post("trip", {
        trip_type_id: thiss.state.TempTaxiType.id,
        passenger_id: thiss.state.passenger_id,
        voucher_id: thiss.state.voucherId,
        from_latitude: thiss.state.OriginCoordinates.latitude,
        from_longitude: thiss.state.OriginCoordinates.longitude,
        to_latitude: thiss.state.DestinationCoordinates.latitude,
        to_longitude: thiss.state.DestinationCoordinates.longitude,
        note: thiss.state.NoteToDriver,
        token: thiss.state.Token,
        price: thiss.state.TempTaxiType.price,
        distance: thiss.state.TempTaxiType.distance,
        duration: thiss.state.TempTaxiType.duration,
        to_address: thiss.state.ToAddress,
        from_address: thiss.state.FromAddress
      })
      .then(function(response) {
        if (response.data.is_successful) {
          thiss.setState({
            TripCodeFromServer: response.data.data.trip_code,
            TripIdFromServer: response.data.data.trip_id,
            Page: "loading"
          });
          setTimeout(() => {
            thiss._FetchingDriver();
          }, 1000);
        } else {
        }
      })
      .catch(function(error) {
        thiss.setState({
          Page: "reservation"
        });
      });
  };
  _StartReserve = () => {
    var thiss = this;
    axios
      .post("trip", {
        trip_type_id: thiss.state.TempTaxiType.id,
        passenger_id: thiss.state.passenger_id,
        voucher_id: thiss.state.voucherId,
        from_latitude: thiss.state.OriginCoordinates.latitude,
        from_longitude: thiss.state.OriginCoordinates.longitude,
        to_latitude: thiss.state.DestinationCoordinates.latitude,
        to_longitude: thiss.state.DestinationCoordinates.longitude,
        note: thiss.state.NoteToDriver,
        token: thiss.state.Token,
        reserved_at: thiss.state.Date + " " + thiss.state.Time,
        price: thiss.state.TempTaxiType.price,
        distance: thiss.state.TempTaxiType.distance,
        duration: thiss.state.TempTaxiType.duration,
        to_address: thiss.state.ToAddress,
        from_address: thiss.state.FromAddress
      })
      .then(function(response) {
        if (response.data.is_successful) {
          thiss.setState({
            ReserveCodeFromServer: response.data.data.trip_code,
            ReserveIdFromServer: response.data.data.trip_id,
            Page: "loading"
          });
          setTimeout(() => {
            thiss.setState({
              Page: "successReserve"
            });
          }, 5000);
        }
      })
      .catch(function(error) {});
  };
  Counter() {
    var answer = false;
    setTimeout(() => {
      answer = true;
    }, 15000);
    return answer;
  }
  _FetchingDriver = () => {
    this.setState({
      mainCounter: 2
    });
    var that = this;
    var channel = pusher.subscribe(
      `trip-passenger-${that.state.TripIdFromServer}`
    );
    channel.bind("driver-accepted", function(data) {
      that._DriverAccepted(data);
    });
    channel.bind("driver-arrived", function() {
      that.PlaySound2();
      that.state.DriverLocationInterval.map(item => {
        clearInterval(item);
      });
      that.GetDriverLocation();
      that.setState({
        arrived: true,
        ShouldPlay: true,
        arrivedModal: true,
        CancelCash: "5 CAD"
      });
    });
    channel.bind("driver-is-near", function() {
      that.PlaySound();
      // that.setState({
      //     driverNearModal: true,
      // })
    });
    channel.bind("admin-trip-canceled", function() {
      that._cancelAdmin();
      that.setState({
        mainCounter: 0
      });
    });
    channel.bind("driver-started-to-move", function() {
      that.PlaySound();
      that.StartToMove();
    });
    channel.bind("passenger-picked-up", function() {
      that._PickUp();
      that.setState({
        pickedUpModal: true
      });
    });
    channel.bind("payment-failed", function(data) {
      that.setState({
        Page: "payFailed"
      });
    });
    channel.bind("trip-canceled", function(data) {
      that._cancel();
      that.setState({
        mainCounter: 0
      });
    });
    channel.bind("trip-paid", function(data) {
      that._FinishTrip(data);
    });
    channel.bind("trip-finished", function(data) {
      that._FinishTrip2(data);
    });
    channel.bind("new-message", function(data) {
      var msg = data.message;
      if (that.state.PageWithChat[0] !== "chat") {
        alert("New message");
      }
      that.PlaySound();
      that._PushMessage(msg);
    });
  };
  StartToMove = () => {
    this.setState({
      Page: "start",
      counter: 1
    });
    this.GetDriverLocation();
  };
  _DriverAccepted = data => {
    this.GetDriverLocation();
    this.PlaySound();
    this.setState({
      DriverAcceptedData: data,
      Page: "start"
    });
  };
  GetDriverLocation = () => {
    setTimeout(async () => {
      if (this.state.Token === null) {
        const Token = await AsyncStorage.getItem("token");
        const PassengerId = await AsyncStorage.getItem("passenger_id");
        this.setState({
          Token: Token,
          passenger_id: PassengerId
        });
        this.GetDriverLocation();
      } else {
        var interval = setInterval(() => {
          var that = this;
          axios
            .post("trip/driver_location", {
              passenger_id: that.state.passenger_id,
              token: that.state.Token,
              trip_id:
                that.state.TripIdFromServer === null
                  ? that.props.oldData.trip_id
                  : that.state.TripIdFromServer
            })
            .then(function(response) {
              if (response.data.is_successful) {
                that.setState({
                  DriverLocation: response.data.data
                });
              } else {
                alert(response.data.message);
              }
            })
            .catch(function(err) {});
        }, 5000);
        this.setState({
          DriverLocationInterval: [
            ...this.state.DriverLocationInterval,
            interval
          ]
        });
      }
    }, 1000);
  };
  _cancel = () => {
    let is_reserve =
      this.props.oldData !== null
        ? this.props.oldData.reserved_at
        : this.state.DriverAcceptedData.reserved_at;
    var that = this;
    pusher.unsubscribe(
      `trip-passenger-${
        that.state.TripIdFromServer !== null
          ? that.state.TripIdFromServer
          : that.props.oldData.trip_id
      }`
    );
    this.PlaySound();
    that.state.DriverLocationInterval.map(item => {
      clearInterval(item);
    });
    if (is_reserve == null) {
      this.setState({
        Page: "CancelDriver",
        mainCounter: 0
      });
      setTimeout(() => {
        this._StartTrip();
      }, 4000);
    } else {
      this.setState({
        Page: "reserveCancel",
        mainCounter: 0
      });
      setTimeout(() => {
        this.setState(
          {
            Page: "main",
            mainCounter: 0
          },
          4000
        );
      });
    }
  };
  _cancelAdmin = () => {
    var that = this;
    pusher.unsubscribe(
      `trip-passenger-${
        that.state.TripIdFromServer !== null
          ? that.state.TripIdFromServer
          : that.props.oldData.trip_id
      }`
    );
    this.PlaySound();
    that.state.DriverLocationInterval.map(item => {
      clearInterval(item);
    });
    this.setState({
      Page: "adminCancel",
      mainCounter: 0
    });
  };
  _Voucher = () => {
    var that = this;
    axios
      .post("voucher", {
        passenger_id: that.state.passenger_id,
        token: that.state.Token,
        code: that.state.VoucherVal
      })
      .then(function(response) {
        if (response.data.is_successful) {
          that.setState({
            promoStatus: "success",
            voucherId: response.data.data.id,
            voucherStatus: true
          });
        } else {
          that.setState({
            promoStatus: "error"
          });
          setTimeout(() => {
            that.setState({
              promoStatus: null
            });
          }, 2000);
        }
      })
      .catch(function(err) {});
  };
  _PickUp = () => {
    this.PlaySound();
    this.setState({
      Page: "seat"
    });
  };
  _FinishTrip2 = data => {
    let lol = JSON.stringify(data.final_price);
    this.PlaySound();
    this.setState({
      finishedCost: lol,
      Page: "finished"
    });
  };
  _FinishTrip = () => {
    this.setState({
      mainCounter: 0
    });
    this.PlaySound();
    this.state.DriverLocationInterval.map(item => {
      clearInterval(item);
    });
    this.setState({
      Page: "finish"
    });
    this.props.Status(true);
    console.log("line 911");
  };
  getFavorites = () => {
    if (this.state.Token && this.state.passenger_id !== null) {
      var thiss = this;
      axios
        .post("passenger/addresses", {
          token: thiss.state.Token,
          passenger_id: thiss.state.passenger_id
        })
        .then(function(response) {
          if (response.data.is_successful) {
            thiss._BuildFavoriteArray(response.data.data);
          } else {
          }
        })
        .catch(function(error) {});
    } else {
      setTimeout(() => {
        this.getFavorites();
      }, 2000);
    }
  };
  _BuildFavoriteArray = item => {
    // console.log(item)
    this.setState({ Favorite: item });
    // item.map(item => {
    //     let fav = {
    //         id: item.id,
    //         description: item.title,
    //         geometry: { location: { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) } }
    //     }
    //     this.setState({ Favorite: [...this.state.Favorite, fav] })
    // })
  };
  onRegionChange(region) {
    this.setState({
      Region: {
        latitude: parseFloat(region.latitude),
        longitude: parseFloat(region.longitude),
        latitudeDelta: region.latitudeDelta ? region.latitudeDelta : 0.0040 ,
        longitudeDelta: region.longitudeDelta ? region.longitudeDelta : 0.0040
      }
    });
    this.SendLocationToRecieveDrivers();
  }

  onChange = time => this.setState({ time });

  _setDestinationMarker() {
    this.setState({
      DestinationCoordinates: { ...this.state.Region }
    });
  }
  _setOriginMarker() {
    this.setState({
      OriginCoordinates: { ...this.state.Region }
    });
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  _SubmitReserve() {
    if (this.state.Date && this.state.Time) {
      this._StartReserve();
    } else {
      alert("Choose Date And Time");
    }
  }
  _SetDate(date) {
    let Date = moment(date.currentDate).format("YYYY-MM-DD");
    this.setState({ Date: Date });
  }
  selector = item => {
    this.setState({
      TempTaxiType: item,
      ValueTaxiType: item.id
    });
  };
  _SetTime = time => {
    let Time = moment(time, ["h:mm A"]).format("HH:mm:ss");
    let Then = this.state.Date + " " + Time;
    let Now = moment().format("YYYY-MM-DD HH:mm:ss");
    const diff = moment(Then, "YYYY-MM-DD HH:mm:ss").diff(
      moment(Now, "YYYY-MM-DD HH:mm:ss")
    );
    if (diff >= 14400000) {
      this.setState({
        Time: time
      });
    } else {
      alert("Choose more than 4 hour later from now");
    }
  };
  _TripCancel = () => {
    var that = this;
    axios
      .post("trip/cancel", {
        passenger_id:
          that.state.passenger_id !== null
            ? that.state.passenger_id
            : that.props.fullData.passenger_id,
        token:
          that.state.Token !== null
            ? that.state.Token
            : that.props.fullData.token,
        trip_id:
          that.state.TripIdFromServer !== null
            ? that.state.TripIdFromServer
            : that.props.oldData.trip_id
      })
      .then(function(response) {
        if (response.data.is_successful) {
          pusher.unsubscribe(
            `trip-passenger-${
              that.state.TripIdFromServer !== null
                ? that.state.TripIdFromServer
                : that.props.oldData.trip_id
            }`
          );
          that.state.DriverLocationInterval.map(item => {
            clearInterval(item);
          });
          that.setState({
            Page: "main"
          });
          that.props.Status(true);
          that.emptyState();
        } else {
          alert(response.data.message);
        }
      })
      .catch(function(error) {});
  };
  _FinalizeTrip = () => {
    var that = this;
    axios
      .post("trip/rate", {
        rate: that.state.starCount,
        comment: that.state.Note,
        tip: that.state.Tip,
        trip_id:
          that.state.TripIdFromServer !== null
            ? that.state.TripIdFromServer
            : that.props.oldData.trip_id,
        passenger_id: that.state.passenger_id,
        token: that.state.Token
      })
      .then(function(response) {
        if (response.data.is_successful) {
          that.emptyState();
          that.setState({
            removeFinalizeButton: true,
            Page: "main",
            TempTaxiType: null,
            ValueTaxiType: null
          });
        } else {
          alert(response.data.message);
        }
      })
      .catch(function(err) {});
  };
  SetTaxiTypes = response => {
    this.setState({
      Cars: response.trip_types,
      FromAddress: response.from_address,
      ToAddress: response.to_address
    });
  };
  emptyState = () => {
    this.setState({
      VoucherVal: "",
      CancelCash: null,
      arrivedModal: false,
      pickedUpModal: false,
      notification: {},
      promoStatus: null,
      Tip: null,
      removeFinalizeButton: false,
      voucherId: null,
      PageWithChat: [],
      starCount: 0,
      Note: null,
      NoteToDriver: null,
      Date: null,
      Time: null,
      selectedFav: null,
      Cars: null,
      DriverAcceptedData: null,
      TempTaxiType: null,
      ValueTaxiType: null,
      message: null,
      Message: null,
      Messages: [],
      MessageCopy: null,
      taxis: null,
      OriginCoordinates: null,
      DestinationCoordinates: null
    });
  };
  renderTaxis = () => {
    if (this.state.taxis !== null) {
      let taxi = [];
      this.state.taxis.map((item, i) => {
        taxi.push(
          <Marker
            key={i}
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude)
            }}
            image={require("../assets/car2.png")}
            style={{ width: 150, height: 150 }}
          />
        );
      });
      return taxi;
    } else {
      return null;
    }
  };
  EmptyTaxiType = () => {
    this.setState({
      TempTaxiType: null,
      ValueTaxiType: null
    });
  };
  NoteToDriver = note => {
    this.setState({
      NoteToDriver: note
    });
  };
  VoucherValCH = val => {
    this.setState({
      VoucherVal: val
    });
  };
  renderCountDown = () => {
    let counter = 3;
    var interval = setInterval(countDown, 1000);
    function countDown() {
      if (counter === 0) {
        clearInterval(interval);
      } else {
        counter -= counter;
        return counter;
      }
    }
  };
  render() {
    switch (this.state.Page) {
      case "finished":
        return (
          <View style={styles.Container}>
            <TopBar
              title="سفر به پایان رسید"
              leftIcon="menu"
              disable={true}
              ShowMenu={() => this.setState({ Page: "menu" })}
            />
            <View
              style={{
                flex: 1,
                borderTopColor: "#c9c9c9",
                borderTopWidth: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2A2E43"
              }}
            >
              <View
                style={{
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../assets/success.png")}
                  style={{ width: 50, height: 50, marginTop: 15 }}
                />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "Medium",
                    textAlign: "center"
                  }}
                >
                  سفر به پایان رسید
                </Text>
                <Text
                  style={{
                    marginTop: 15,
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "Medium",
                    textAlign: "center"
                  }}
                >
                  در انتظار راننده برای انتخاب نوع پرداخت
                </Text>
              </View>
            </View>
          </View>
        );
        break;
      case "paySuccessful":
        return (
          <View
            style={[
              styles.Container,
              { alignItems: "center", justifyContent: "flex-end" }
            ]}
          >
            <TopBar
              title="Tip"
              leftIcon="menu"
              disable={true}
              ShowMenu={() => this.setState({ Page: "menu" })}
            />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2A2E43",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10
              }}
            >
              <View
                style={{
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../assets/success.png")}
                  style={{
                    width: 50,
                    height: 50,
                    marginBottom: 15,
                    marginTop: 15
                  }}
                />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "Medium",
                    textAlign: "center"
                  }}
                >
                  سفر با موفقیت پرداخت شد
                </Text>
              </View>
            </View>
          </View>
        );
        break;
      case "adminCancel":
        setTimeout(() => {
          this.setState({
            Page: "main"
          });
        }, 3300);
        return (
          <View
            style={[
              styles.Container,
              { alignItems: "center", justifyContent: "flex-end" }
            ]}
          >
            <TopBar title="سرویس لغو شد" leftIcon="menu" disable={true} />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "Medium",
                  writingDirection: "rtl",
                  textAlign: "center"
                }}
              >
                سفر توسط ادمین لغو شد
              </Text>
            </View>
          </View>
        );
        break;
      case "CancelDriver":
        return (
          <View
            style={[
              styles.Container,
              { alignItems: "center", justifyContent: "flex-end" }
            ]}
          >
            <TopBar title="سرویس لغو شد" disable={true} />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center"
              }}
            >
              <Text style={{ fontFamily: "Medium", writingDirection: "rtl" }}>
                سرویس توسط راننده لغو شد. سیستم تا 3 ثانیه دیگر سفر جدیدی را
                برای شما در نظر میگیرد
              </Text>
            </View>
          </View>
        );
        break;
      case "reserveCancel":
        return (
          <View
            style={[
              styles.Container,
              { alignItems: "center", justifyContent: "flex-end" }
            ]}
          >
            <TopBar title="سرویس لغو شد" disable={true} />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontFamily: "Medium", writingDirection: "rtl" }}>
                درخواست رزرو شما لغو شد. سیستم به صورت اتوماتیک یک راننده جدید
                برای شما آماده میکند
              </Text>
            </View>
          </View>
        );
        break;
      case "payFailed":
        return (
          <View
            style={[
              styles.Container,
              { alignItems: "center", justifyContent: "flex-end" }
            ]}
          >
            <TopBar
              title="انعام"
              leftIcon="menu"
              disable={true}
              ShowMenu={() => this.setState({ Page: "menu" })}
            />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2A2E43",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10
              }}
            >
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../assets/wrong.png")}
                  style={{
                    width: 50,
                    height: 50,
                    marginBottom: 15,
                    marginTop: 15
                  }}
                />
                <Texاt
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "Medium",
                    textAlign: "center"
                  }}
                >
                  پرداخت موفقیت آمیز نبود. حساب بانکی خود را بررسی کنید
                </Texاt>
              </View>
            </View>
          </View>
        );
        break;
      case "finish":
        return (
          <View style={{ width: width, height: height, position: "relative" }}>
            <TopBar
              title="پایان سفر"
              leftIcon="menu"
              disable={true}
              ShowMenu={() => this.setState({ Page: "menu" })}
            />
            <KeyboardAvoidingView enabled={true} behavior="position">
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#2A2E43",
                  height: height - 70
                }}
              >
                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    source={require("../assets/success.png")}
                    style={{
                      width: 50,
                      height: 50,
                      marginBottom: 15,
                      marginTop: 15
                    }}
                  />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontFamily: "Medium",
                      textAlign: "center"
                    }}
                  >
                    سفر به اتمام رسید. هزینه سفر: {this.state.finishedCost}{" "}
                    تومان
                  </Text>
                </View>
                <View style={styles.rateContainer}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    fullStarColor="#eeee00"
                    halfStarColor="#eeee00"
                    starSize={30}
                    rating={this.state.starCount}
                    selectedStar={rating => this.onStarRatingPress(rating)}
                  />
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    onChangeText={Note => this.setState({ Note })}
                    value={this.state.Note}
                    placeholderTextColor="#7a7a7a"
                    placeholder="نظر خود را درباره راننده بنویسید"
                    style={[styles.TextInputStyle, { fontFamily: "Medium" }]}
                  />
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 14,
                      fontFamily: "Medium",
                      marginHorizontal: 15,
                      marginVertical: 15
                    }}
                  >
                    به راننده انعام میدهید?
                  </Text>
                  <TextInput
                    multiline={false}
                    onChangeText={Tip => this.setState({ Tip })}
                    value={this.state.Tip}
                    placeholder="چند تومان؟"
                    style={[styles.TextInputStyle, { fontFamily: "Medium" }]}
                    keyboardType="number-pad"
                    maxLength={2}
                    keyboardAppearance="light"
                  />
                  <TouchableOpacity
                    style={styles.rateSubmitButton}
                    onPress={() => this._FinalizeTrip()}
                  >
                    <Text
                      style={[
                        styles.rateSubmitButtonText,
                        { fontFamily: "Medium" }
                      ]}
                    >
                      ثبت
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        );
        break;
      case "seat":
        return (
          <View style={styles.Container}>
            <TopBar
              title="درحال سفر"
              leftIcon="menu"
              disable={true}
              ShowMenu={() => this.setState({ Page: "menu" })}
            />
            <MapView
              style={{ flex: 1 }}
              region={this.state.Region}
              showsMyLocationButton={true}
              showsUserLocation={true}
            >
              <Marker
                image={require("../assets/DestinationPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={
                  this.state.DestinationCoordinates !== null
                    ? this.state.DestinationCoordinates
                    : {
                        latitude: parseFloat(this.props.oldData.to_latitude),
                        longitude: parseFloat(this.props.oldData.to_longitude)
                      }
                }
              />
              {this.state.DriverLocation === null ? null : (
                <Marker
                  image={require("../assets/car2.png")}
                  style={{
                    width: 65,
                    height: 65,
                    zIndex: 200
                  }}
                  coordinate={{
                    latitude: parseFloat(this.state.DriverLocation.latitude),
                    longitude: parseFloat(this.state.DriverLocation.longitude)
                  }}
                />
              )}
            </MapView>
            <CarDetail
              Data={
                this.state.DriverAcceptedData !== null
                  ? this.state.DriverAcceptedData
                  : this.props.oldData
              }
            />
          </View>
        );
        break;
      case "successReserve":
        return (
          <View style={styles.Container2}>
            <TopBar
              title="رزرو ثبت شد"
              leftIcon="menu"
              ShowMenu={() => this.setState({ Page: "menu" })}
            />
            <View style={{ marginTop: 100 }}>
              <Text style={[styles.text, { fontFamily: "Medium" }]}>
                درخواست شما ثبت شد.{`\n`}
                اطلاعات راننده در قسمت رزروها به زودی{`\n`}
                قابل نمایش خواهد بود
              </Text>
              <TouchableOpacity
                style={styles.PrimaryButton}
                onPress={() => this.setState({ Page: "main" })}
              >
                <Text
                  style={[styles.PrimaryButtonText, { fontFamily: "Medium" }]}
                >
                  بازگشت به صفحه اصلی
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        break;
      case "start":
        let cancelAfterAccept = false;
        return (
          <View style={styles.Container}>
            <Modal isVisible={this.state.arrivedModal}>
              <View
                style={{
                  width: width - 40,
                  alignSelf: "center",
                  justifyContent: "center",
                  alingItems: "center",
                  backgroundColor: "white",
                  borderRadius: 10,
                  height: height / 5
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Medium",
                    textAlign: "center",
                    alignSelf: "center"
                  }}
                >
                  راننده رسید
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ arrivedModal: false, ShouldPlay: false }),
                      this.StopSound();
                  }}
                  style={{
                    backgroundColor: "#2a2e43",
                    width: 150,
                    paddingVertical: 10,
                    borderRadius: 5,
                    alignSelf: "center",
                    marginTop: 20
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "Medium"
                    }}
                  >
                    خب!
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <Modal isVisible={cancelAfterAccept}>
              <View
                style={{
                  width: width - 40,
                  alignSelf: "center",
                  justifyContent: "center",
                  alingItems: "center",
                  backgroundColor: "white",
                  borderRadius: 10,
                  height: height / 5
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Medium",
                    textAlign: "center",
                    alignSelf: "center"
                  }}
                >
                  مطمئنی ?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this._TripCancel();
                  }}
                  style={{
                    backgroundColor: "#2a2e43",
                    width: (width - 40) / 2,
                    paddingVertical: 10,
                    borderRadius: 5,
                    alignSelf: "center",
                    marginTop: 20
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "Medium"
                    }}
                  >
                    بله
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    cancelAfterAccept = false;
                  }}
                  style={{
                    backgroundColor: "white",
                    width: (width - 40) / 2,
                    paddingVertical: 10,
                    borderRadius: 5,
                    alignSelf: "center",
                    marginTop: 20
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      textAlign: "center",
                      fontFamily: "Medium"
                    }}
                  >
                    خیر
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <ShowDriver
              arrived={this.state.arrived}
              CancelCash={
                this.state.CancelCash !== null ? this.state.CancelCash : null
              }
              GoToChatPage={() =>
                this.setState({
                  PageWithChat: [...this.state.PageWithChat, "chat"]
                })
              }
              PageWithChat={this.state.PageWithChat}
              region={this.state.Region}
              setMessage={val => this.setState({ Message: val })}
              Message={this.state.Message}
              BackFromChat={() => this.state.PageWithChat.pop()}
              renderMessage={() => this.renderMessages()}
              sendMessage={() => this._SendMessage()}
              Data={this.state.DriverAcceptedData}
              oldData={this.props.oldData}
              DriverLocation={this.state.DriverLocation}
              OriginCoordinates={this.state.OriginCoordinates}
              DestinationCoordinates={this.state.DestinationCoordinates}
              ShowMenu={() => this.setState({ Page: "menu" })}
              cancel={() => (cancelAfterAccept = true)}
              taxiArrived={() => this.setState({ Page: "seat" })}
            />
          </View>
        );
        break;
      case "firstPageLoading":
        return <AppLoadingScreen />;
        break;
      case "loading":
        return (
          <>
            <Modal isVisible={this.state.cancelBeforeAccept}>
              <View
                style={{
                  width: width - 40,
                  alignSelf: "center",
                  justifyContent: "center",
                  alingItems: "center",
                  backgroundColor: "white",
                  borderRadius: 10,
                  height: height / 5
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Medium",
                    textAlign: "center",
                    alignSelf: "center"
                  }}
                >
                  مطمئنی ?
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this._TripCancel();
                    }}
                    style={{
                      backgroundColor: "#2a2e43",
                      width: (width - 60) / 2,
                      paddingVertical: 10,
                      borderRadius: 5,
                      alignSelf: "center",
                      marginTop: 20
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Medium"
                      }}
                    >
                      بله
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ cancelBeforeAccept: false })}
                    style={{
                      backgroundColor: "white",
                      width: (width - 40) / 2,
                      paddingVertical: 10,
                      borderRadius: 5,
                      alignSelf: "center",
                      marginTop: 20
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        fontFamily: "Medium"
                      }}
                    >
                      خیر
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              <Image
                source={require("../assets/loading.gif")}
                style={{ width: width, height: width }}
              />
              <View />
              <TouchableOpacity
                onLongPress={() => this.setState({ cancelBeforeAccept: true })}
              >
                <Text style={{ fontFamily: "Medium" }}>لغو سرویس</Text>
              </TouchableOpacity>
            </View>
          </>
        );
        break;
      default:
        return (
          <HomeViewNew
            baseLat={this.state.baseLat}
            baseLong={this.state.baseLong}
            onPressOriginPlaces={() =>
              this.setState({
                OriginCoordinates: {
                  latitude: this.state.Region.latitude,
                  longitude: this.state.Region.longitude
                },
                Region2: {
                  latitude: this.state.Region.latitude,
                  longitude: this.state.Region.longitude,
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004
                }
              })
            }
            onPressDestinationPlaces={() =>
              this.setState({
                DestinationCoordinates: {
                  latitude: this.state.Region.latitude,
                  longitude: this.state.Region.longitude
                },
                Region2: {
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004,
                  latitude: this.state.Region.latitude,
                  longitude: this.state.Region.longitude
                }
              })
            }
            onPressOriginPlaces2={detail =>
              this.setState({
                OriginCoordinates: {
                  latitude: detail.latitude,
                  longitude: detail.longitude
                },
                Region2: {
                  latitude: detail.latitude,
                  longitude: detail.longitude,
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004
                }
              })
            }
            onPressDestinationPlaces2={detail =>
              this.setState({
                DestinationCoordinates: {
                  latitude: detail.latitude,
                  longitude: detail.longitude
                },
                Region2: {
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004,
                  latitude: detail.latitude,
                  longitude: detail.longitude
                }
              })
            }
            voucherStatus={this.state.voucherStatus}
            EmptyTaxiType={() => this.EmptyTaxiType()}
            Fullname={this.state.Fullname}
            ReferrerCode={this.state.ReferrerCode}
            getValuesFromAsync={() => this.getValuesFromAsync()}
            Logout2={this.props.Logout2}
            Phonenumber={this.state.Phonenumber}
            Token={this.state.Token}
            passenger_id={this.state.passenger_id}
            ImageUrl={this.state.ImageUrl}
            Email={this.state.Email}
            logout={this.props.logout}
            fullData={this.props.fullData}
            Favorite={this.state.Favorite}
            Region={this.state.Region}
            Region2={this.state.Region2}
            OriginCoordinates={this.state.OriginCoordinates}
            DestinationCoordinates={this.state.DestinationCoordinates}
            onRegionChange={e => this.onRegionChange(e)}
            TripTypeReceived={response => this.SetTaxiTypes(response)}
            _Voucher={() => this._Voucher()}
            VoucherVal={this.state.VoucherVal}
            promoStatus={this.state.promoStatus}
            VoucherValCH={val => this.VoucherValCH(val)}
            Cars={this.state.Cars}
            NoteToDriver={note => this.NoteToDriver(note)}
            NoteToDriverVal={this.state.NoteToDriver}
            selector={item => this.selector(item)}
            TempTaxiType={this.state.TempTaxiType}
            FromAddress={this.state.FromAddress}
            ToAddress={this.state.ToAddress}
            ValueTaxiType={this.state.ValueTaxiType}
            renderTaxis={this.state.taxis === null ? null : this.renderTaxis()}
            _setCentered={() => this._setCentered()}
            _setOriginMarker={() => this._setOriginMarker()}
            _setDestinationMarker={() => this._setDestinationMarker()}
            _StartTrip={() => this._StartTrip()}
            _SetDate={date => this._SetDate(date)}
            Time={this.state.Time}
            Date={this.state.Date}
            _SetTime={time => this._SetTime(time)}
            _SubmitReserve={() => this._SubmitReserve()}
          />
        );
        break;
    }
  }
}
const soundObject = new Audio.Sound();
const soundObject2 = new Audio.Sound();
const { width, height } = Dimensions.get("window");
const verticalMiddle = Math.round(width) / 2 - 32.5;
const horizontalMiddle = Math.round(height) / 2 - 32.5;
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
    fontWeight: "200",
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
  SendButton: {
    width: (width / 10) * 1.5,
    height: 70,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  SendButtonText: {
    color: "#2a2e43",
    textAlign: "center"
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
  locator: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  Container: {
    position: "relative",
    flex: 1
  },
  Container2: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  calendarContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  calendarPickerBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#707070",
    padding: 12,
    marginRight: 5
  },
  calendarPickerBtnTxt: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700"
  },
  calendarSubmitBtn: {
    marginLeft: 5,
    backgroundColor: "#2a2e43",
    borderRadius: 10,
    padding: 12
  },
  calendarSubmitBtnTxt: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600"
  },
  OriginSelectorContainer: {
    position: "absolute",
    top: horizontalMiddle,
    right: verticalMiddle
  },
  TextInputStyle: {
    width: (width / 100) * 90,
    padding: 10,
    textAlign: "center",
    borderColor: "#707070",
    backgroundColor: "#d7d7d7",
    color: "#000",
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 10
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  },
  PrimaryButton: {
    width: (width / 100) * 90,
    padding: 15,
    backgroundColor: "#2A2E43",
    marginTop: 100,
    marginBottom: 20,
    borderRadius: 10
  },
  PrimaryButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },
  rateSubmitButton: {
    width: (width / 100) * 80,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 50,
    backgroundColor: "#ffffff"
  },
  rateSubmitButtonText: {
    textAlign: "center",
    color: "#2a2e43",
    fontSize: 16,
    fontWeight: "800"
  },
  rateContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  DatePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
    paddingVertical: 10,
    width: (width / 100) * 80,
    marginHorizontal: width / 10,
    borderColor: "#707070",
    borderWidth: 0.2,
    borderRadius: 10
  },
  submitBtn: {
    width: (width / 10) * 8,
    paddingVertical: 15,
    borderRadius: 40,
    backgroundColor: "#2a2e43",
    marginLeft: width / 10,
    marginVertical: 15
  },
  submitBtnTxt: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center"
  }
});
export default Home;
