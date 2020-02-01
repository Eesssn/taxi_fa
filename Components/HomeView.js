import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  BackHandler,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import DatePicker from "react-native-date-ranges";
import TimePicker from "react-native-datepicker";
import axios from "axios";

import ChooseTaxiType from "./ChooseTaxiType";
import OrderType from "./ChooseOrderType";
import Reservation from "./ReserveType";
import PromoCode from "./PromoCode";
import TakeNote from "./TakeNote";
import LeftMenu from "./LeftMenu";
import TopBar from "./TopBar";

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      Page: [],
      Page2: null,
      FromAddressMine: null,
      value: null
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackButton = () => {
    var backer = this.state.Page;
    var numberic = this.state.Page.length;
    var last = this.state.Page[numberic - 1];
    backer.pop();
    if (last === "taxiType") {
      this.setState({
        Page: backer
      });
      this.props.EmptyTaxiType();
    } else {
      this.setState({
        Page: backer
      });
    }
    return true;
  };

  ShowMenu = () => {
    this.setState(state => {
      const MyStack = state.Page.push("menu");
      return {
        MyStack,
        value: null
      };
    });
  };

  _setOriginMarker = () => {
    this.props.onPressOriginPlaces();
    this.setState({ Page: [...this.state.Page, "selectDestination"] });
  };

  _setDestinationMarker = () => {
    this.props.onPressDestinationPlaces();
    this.setState({ Page2: "waitingForServiceType" });
    setTimeout(() => {
      this.getTripTypeAndCost();
    }, 1000);
  };

  getTripTypeAndCost = () => {
    var thiss = this;
    axios
      .post("trip/estimate", {
        passenger_id: this.props.passenger_id,
        token: this.props.Token,
        to_latitude: this.props.DestinationCoordinates.latitude,
        to_longitude: this.props.DestinationCoordinates.longitude,
        from_latitude: this.props.OriginCoordinates.latitude,
        from_longitude: this.props.OriginCoordinates.longitude
      })
      .then(function(response) {
        if (response.data.is_successful) {
          thiss.TaxiTypes(response);
        } else {
          alert(response.data.message);
          thiss.handleBackButton();
        }
      })
      .catch(function(error) {});
  };

  TaxiTypes = response => {
    this.props.TripTypeReceived(response.data.data);
    this.setState({
      Page: [...this.state.Page, "taxiType"],
      Page2: null
    });
  };

  onPressOriginPlaces = details => {
    this.props.onPressOriginPlaces2(details);
    this.setState({
      Page: [...this.state.Page, "selectDestination"]
    });
  };

  onPressDestinationPlaces = details => {
    this.props.onPressDestinationPlaces2(details);
    this.setState({
      Page2: "waitingForServiceType"
    });
  };

  render() {
    let indexer = this.state.Page.length;
    let key = this.state.Page[indexer - 1];
    if (this.state.Page2) {
      return (
        <View style={{ flex: 1 }}>
          <TopBar
            title="بارگزاری سرویس ها"
            leftIcon="back"
            ShowMenu={() => this.setState({ Page2: null })}
          />
          <View
            style={{
              marginVertical: 20,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              source={require("../assets/loading.gif")}
              style={{ width: width, height: width }}
            />
            <Text
              style={{
                textAlign: "center",
                marginTop: 50,
                fontFamily: "Medium"
              }}
            >
              در حال دریافت اطلاعات ...
            </Text>
          </View>
        </View>
      );
    }
    switch (key) {
      case "book":
        return (
          <View style={styles.Container}>
            <TopBar
              title="رزرو"
              leftIcon="back"
              ShowMenu={() => this.handleBackButton()}
            />
            <MapView style={{ flex: 1 }} region={this.props.Region}>
              <Marker
                image={require("../assets/OriginPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.OriginCoordinates}
              />
              <Marker
                image={require("../assets/DestinationPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.DestinationCoordinates}
              />
            </MapView>
            <View style={{ paddingVertical: 60 }}>
              <DatePicker
                style={styles.DatePickerBtn}
                customStyles={{
                  placeholderText: { fontSize: 20 },
                  headerStyle: { backgroundColor: "#2a2e43" },
                  headerMarkTitle: { color: "#ffffff", textAlign: "center" },
                  headerDateTitle: {},
                  contentInput: {},
                  contentText: { fontSize: 13 }
                }}
                centerAlign
                markText={"Choose Date"}
                ButtonText={"Done"}
                allowFontScaling={false}
                placeholder={"Select Date"}
                selectedBgColor="#2a2e43"
                selectedTextColor="white"
                blockBefore={true}
                onConfirm={date => this.props._SetDate(date)}
              />
              <TimePicker
                style={{ width: (width / 10) * 9 }}
                date={this.props.Time}
                showIcon={false}
                is24Hour={false}
                mode="time"
                placeholder="select Time"
                format="LT"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={time => {
                  this.props._SetTime(time);
                }}
              />
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={this.props._SubmitReserve}
              >
                <Text style={[styles.submitBtnTxt, { fontFamily: "Medium" }]}>
                  ثبت
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        break;
      case "reservation":
        return (
          <View style={styles.Container}>
            <TopBar
              title="درخواست برای همین الان?"
              leftIcon="back"
              ShowMenu={() => this.handleBackButton()}
            />
            <MapView style={{ flex: 1 }} region={this.props.Region}>
              <Marker
                image={require("../assets/OriginPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.OriginCoordinates}
              />
              <Marker
                image={require("../assets/DestinationPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.DestinationCoordinates}
              />
            </MapView>
            <Reservation
              Reserved={() =>
                this.setState({ Page: [...this.state.Page, "book"] })
              }
              Booknow={this.props._StartTrip}
            />
          </View>
        );
        break;
      case "note":
        return (
          <View style={styles.Container}>
            <TopBar
              title="ارسال یادداشت"
              leftIcon="back"
              ShowMenu={() => this.handleBackButton()}
            />
            <MapView style={{ flex: 1 }} region={this.props.Region}>
              <Marker
                image={require("../assets/OriginPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.OriginCoordinates}
              />
              <Marker
                image={require("../assets/DestinationPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.DestinationCoordinates}
              />
            </MapView>
            <TakeNote
              SetNote={note => this.props.NoteToDriver(note)}
              NoteVal={this.props.NoteToDriverVal}
              FinishNote={() =>
                this.setState({ Page: [...this.state.Page, "reservation"] })
              }
            />
          </View>
        );
        break;
      case "promo":
        if (this.props.voucherStatus) {
          setTimeout(() => {
            this.handleBackButton();
          }, 1000);
        }
        return (
          <View style={styles.Container}>
            <TopBar
              title="کد تخفیف"
              leftIcon="back"
              ShowMenu={() => this.handleBackButton()}
            />
            <MapView style={{ flex: 1 }} region={this.props.Region}>
              <Marker
                image={require("../assets/OriginPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.OriginCoordinates}
              />
              <Marker
                image={require("../assets/DestinationPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={this.props.DestinationCoordinates}
              />
            </MapView>
            <PromoCode
              voucherStatus={this.props.voucherStatus}
              submit={this.props._Voucher}
              sumbitValue={this.props.VoucherVal}
              sumbitValueCH={val => this.props.VoucherValCH(val)}
              promoStatus={this.props.promoStatus}
            />
          </View>
        );
        break;
      case "taxiType":
        return (
          <View style={styles.Container}>
            <TopBar
              title="انتخاب نوع سرویس"
              leftIcon="back"
              ShowMenu={() => {
                this.handleBackButton();
                this.props.EmptyTaxiType();
              }}
            />
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: parseFloat(
                  this.props.DestinationCoordinates.latitude
                ),
                longitude: parseFloat(
                  this.props.DestinationCoordinates.longitude
                ),
                latitudeDelta: this.props.Region.latitudeDelta,
                longitudeDelta: this.props.Region.longitudeDelta
              }}
            >
              <Marker
                image={require("../assets/OriginPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={{
                  latitude: parseFloat(this.props.OriginCoordinates.latitude),
                  longitude: parseFloat(this.props.OriginCoordinates.longitude)
                }}
              />
              <Marker
                image={require("../assets/DestinationPinSelected.png")}
                style={{ width: 65, height: 65 }}
                coordinate={{
                  latitude: parseFloat(
                    this.props.DestinationCoordinates.latitude
                  ),
                  longitude: parseFloat(
                    this.props.DestinationCoordinates.longitude
                  )
                }}
              />
            </MapView>
            <ChooseTaxiType
              voucherStatus={this.props.voucherStatus}
              TempTaxiType={this.props.TempTaxiType}
              ValueTaxiType={this.props.ValueTaxiType}
              selector={item => this.props.selector(item)}
              PromoCode={() =>
                this.setState({ Page: [...this.state.Page, "promo"] })
              }
              Cars={this.props.Cars}
              TakeNote={
                this.props.TempTaxiType !== null
                  ? () => this.setState({ Page: [...this.state.Page, "note"] })
                  : () => alert("choose a service type")
              }
            />
          </View>
        );
        break;
      case "selectDestination":
        console.log("Region is : ", this.props.Region);
        console.log("Region 2 is : ", this.props.Region2);
        console.log("origin coordinates is: ", this.props.OriginCoordinates);
        return (
          <View style={styles.Container}>
            <TopBar
              title="انتخاب مقصد"
              leftIcon="back"
              ShowMenu={() => this.handleBackButton()}
            />
            {this.props.Favorite.length > 0 ? (
              <View style={{ height: 35, width }}>
                <ScrollView horizontal>
                  {this.props.Favorite.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.onPressDestinationPlaces(item);
                          setTimeout(() => {
                            this.getTripTypeAndCost();
                          }, 1000);
                        }}
                        style={{
                          borderColor: "gray",
                          borderWidth: 0.5,
                          borderRadius: 100,
                          paddingVertical: 7,
                          paddingHorizontal: 12,
                          marginHorizontal: 10
                        }}
                        key={index}
                      >
                        <Text>{item.title}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ) : (
              <View style={{ height: 35 }}>
                <Text style={{ fontFamily: "Light" }}>
                  مسیر های منتخب خود را می توانید در تنظیمات بررسی کنید
                </Text>
              </View>
            )}
            {this.props.Region ? (
              <MapView
                initialRegion={{
                  latitude: parseFloat(this.props.Region.latitude),
                  latitudeDelta: this.props.Region.latitudeDelta,
                  longitude: parseFloat(this.props.Region.longitude),
                  longitudeDelta: this.props.Region.longitudeDelta
                }}
                style={{ width: width, height: height - 70, padding: 0 }}
                showsBuildings={true}
                showsMyLocationButton={true}
                showsCompass={true}
                toolbarEnabled={true}
                loadingEnabled={true}
                loadingIndicatorColor={"#2a2e43"}
                loadingBackgroundColor={"white"}
                showsUserLocation={true}
                onRegionChangeComplete={e => {
                  this.props.onRegionChange(e);
                }}
              >
                <Marker
                  image={require("../assets/OriginPinSelected.png")}
                  style={{ width: 65, height: 65 }}
                  coordinate={{
                    latitude: parseFloat(this.props.OriginCoordinates.latitude),
                    longitude: parseFloat(
                      this.props.OriginCoordinates.longitude
                    )
                  }}
                />
                {this.props.DestinationCoordinates ? (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(
                        this.props.DestinationCoordinates.latitude
                      ),
                      longitude: parseFloat(
                        this.props.DestinationCoordinates.longitude
                      )
                    }}
                  />
                ) : null}
              </MapView>
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )}
            <TouchableOpacity
              onPress={() => this._setDestinationMarker()}
              style={styles.OriginSelectorContainer}
            >
              <Image
                source={require("../assets/DestinationPin.png")}
                style={{ width: 65, height: 65 }}
              />
            </TouchableOpacity>
            {/* <OrderType Places={() => this.setState({ Page: [...this.state.Page, "places"] })} title="جستجو مقصد" /> */}
          </View>
        );
        break;
      // case 'places':
      //     let array = this.props.Favorite
      //     let lol = {
      //         "description": "Current location",
      //         "geometry": {
      //             "location": {
      //                 "lat": this.props.baseLat,
      //                 "lng": this.props.baseLong,
      //             },
      //         },
      //         "id": Math.random(),
      //     }
      //     let newarray = [lol, ...array]
      //     return (
      //         <View style={styles.Container}>
      //             <TopBar title="جستجو" leftIcon="back" ShowMenu={() => this.handleBackButton()} />
      //             <GooglePlacesAutocomplete
      //                 enablePoweredByContainer={false}
      //                 placeholder='جستجو'
      //                 minLength={1} // minimum length of text to search
      //                 autoFocus={true}
      //                 returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      //                 keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      //                 listViewDisplayed='auto'    // true/false/undefined
      //                 fetchDetails={true}
      //                 renderDescription={row => row.description} // custom description render
      //                 onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
      //   this.onPressDestinationPlaces(details)
      //   setTimeout(() => {
      //       this.getTripTypeAndCost()
      //   }, 1000);
      //                 }}

      //                 getDefaultValue={() => ''}

      //                 query={{
      //                     // available options: https://developers.google.com/places/web-service/autocomplete
      //                     key: 'AIzaSyBZ2aQnzxcjjvcLjD6I6LEpbuE7kNMbvN4',
      //                     language: 'en', // language of the results
      //                     types: '', // default: 'geocode'
      //                     location:this.props.baseLat+","+this.props.baseLong ,
      //                     radius:'50000',
      //                     rankby:'distance'
      //                 }}

      //                 styles={{
      //                     textInputContainer: {
      //                         width: '100%'
      //                     },
      //                     description: {
      //                         fontWeight: 'bold'
      //                     },
      //                     predefinedPlacesDescription: {
      //                         color: '#1faadb'
      //                     }
      //                 }}

      //                 currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
      //                 //   currentLocationLabel="Current location"
      //                 nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      //                 GoogleReverseGeocodingQuery={{
      //                     // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      //                 }}
      //                 GooglePlacesSearchQuery={{
      //                     // location:this.props.baseLat+","+this.props.baseLong ,
      //                     // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
      //                     rankby: 'distance',
      //                     type: ''
      //                 }}

      //                 GooglePlacesDetailsQuery={{
      //                     // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
      //                     fields: 'formatted_address',
      //                 }}

      //                 filterReverseGeocodingByTypes={['locality']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      //                 predefinedPlaces={newarray}

      //                 debounce={0} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      //             />
      //         </View>
      //     )
      //     break;
      // case "OriginPlaces":
      //     let array2 = this.props.Favorite
      //     let lol2 = {
      //         "description": "Current location",
      //         "geometry": {
      //             "location": {
      //                 "lat": this.props.baseLat,
      //                 "lng": this.props.baseLong,
      //             },
      //         },
      //         "id": Math.random(),
      //     }
      //     let newarray2 = [lol2, ...array2]
      //     return (
      //         <View style={styles.Container}>
      //             <TopBar title="جستجو" leftIcon="back" ShowMenu={() => this.handleBackButton()} />
      //             <GooglePlacesAutocomplete
      //                 enablePoweredByContainer={false}
      //                 placeholder='جستجو'
      //                 minLength={1}
      //                 autoFocus={true}
      //                 returnKeyType={'search'}
      //                 keyboardAppearance={'light'}
      //                 listViewDisplayed='auto'
      //                 fetchDetails={true}
      //                 renderDescription={row => row.description}
      //                 onPress={(data, details = null) => {
      //                     this.onPressOriginPlaces(details)
      //                 }}

      //                 getDefaultValue={() => ''}

      //                 query={{
      //                     key: 'AIzaSyBZ2aQnzxcjjvcLjD6I6LEpbuE7kNMbvN4',
      //                     language: 'en',
      //                     types: '',
      //                     location:this.props.baseLat+","+this.props.baseLong ,
      //                     radius:'50000',
      //                     rankby:'distance'
      //                 }}

      //                 styles={{
      //                     textInputContainer: {
      //                         width: '100%',
      //                     },
      //                     description: {
      //                         fontWeight: 'bold'
      //                     },
      //                     predefinedPlacesDescription: {
      //                         color: '#1faadb'
      //                     }
      //                 }}

      //                 currentLocation={false}
      //                 nearbyPlacesAPI='GooglePlacesSearch'
      //                 GooglePlacesSearchQuery={{
      //                     // location:this.props.baseLat+","+this.props.baseLong ,
      //                     rankby: 'distance',
      //                     type: ''
      //                 }}

      //                 GooglePlacesDetailsQuery={{
      //                     fields: 'formatted_address',
      //                 }}
      //                 enableHighAccuracyLocation={true}
      //                 filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
      //                 predefinedPlaces={newarray2}
      //                 debounce={0}
      //                 // renderRightButton={() => <Text>Powered By EESSSN</Text>}
      //             />
      //         </View>
      //     )
      //     break;
      case "menu":
        return (
          <View style={styles.Container}>
            <LeftMenu
              ReferrerCode={this.props.ReferrerCode}
              Logout2={this.props.Logout2}
              HideMenu={() => this.handleBackButton()}
              Name={this.props.Fullname}
              Phone={this.props.Phonenumber}
              Token={this.props.Token}
              fullData={this.props.fullData}
              PassengerId={this.props.passenger_id}
              ImageUrl={this.props.ImageUrl}
              Email={this.props.Email}
              logout={this.props.logout}
              getValuesFromAsync={this.props.getValuesFromAsync}
              addresses={this.props.Favorite}
            />
          </View>
        );
        break;
      default:
        return (
          <View style={styles.Container}>
            <TopBar
              leftIcon="menu"
              title="تاکسی مسیر"
              ShowMenu={() =>
                this.setState({ Page: [...this.state.Page, "menu"] })
              }
            />
            {this.props.Favorite.length > 0 ? (
              <View style={{ height: 35, width }}>
                <ScrollView horizontal>
                  {this.props.Favorite.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.onPressOriginPlaces(item);
                        }}
                        style={{
                          borderColor: "gray",
                          borderWidth: 0.5,
                          borderRadius: 100,
                          paddingVertical: 7,
                          paddingHorizontal: 12,
                          marginHorizontal: 10
                        }}
                        key={index}
                      >
                        <Text>{item.title}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ) : (
              <View style={{ height: 35 }}>
                <Text style={{ fontFamily: "Light" }}>
                  مسیر های منتخب خود را می توانید در تنظیمات بررسی کنید
                </Text>
              </View>
            )}
            <MapView
              initialRegion={this.props.Region2}
              style={{ width: width, height: height - 70, padding: 0 }}
              showsBuildings={true}
              showsMyLocationButton={true}
              showsCompass={true}
              toolbarEnabled={true}
              loadingEnabled={true}
              loadingIndicatorColor={"#2a2e43"}
              loadingBackgroundColor={"white"}
              showsUserLocation={true}
              onRegionChangeComplete={e => {
                this.props.onRegionChange(e);
              }}
            >
              {this.props.OriginCoordinates ? (
                <Marker coordinate={this.props.OriginCoordinates} />
              ) : null}
              {this.props.renderTaxis}
            </MapView>
            {/* <OrderType Favorite={this.props.Favorite} Places={() => this.setState({ Page: [...this.state.Page, "OriginPlaces"] })} title="جستجو مبدا؟" /> */}
            <TouchableOpacity
              onPress={() => this._setOriginMarker()}
              style={styles.OriginSelectorContainer}
            >
              <Image
                source={require("../assets/originPin.png")}
                style={{ width: 65, height: 65 }}
              />
            </TouchableOpacity>
          </View>
        );
        break;
    }
  }
}
const { width, height } = Dimensions.get("window");
const verticalMiddle = Math.round(width) / 2 - 32.5;
const horizontalMiddle = Math.round(height) / 2 + 3.5;
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
    bottom: (width / 100) * 10,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  Container: {
    // position: 'relative',
    flex: 1
  },
  Container2: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  bottomContainer: {
    paddingBottom: 20
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
const myApiKey = "AIzaSyBZ2aQnzxcjjvcLjD6I6LEpbuE7kNMbvN4";
export default HomeView;
