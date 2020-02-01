import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    TextInput
} from 'react-native';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import TopBar from './TopBar';
import Modal from 'react-native-modal';
import Axios from 'axios';

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    });
};

class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFav: null,
            data: [],
            Page: 'main',
            isModalVisible: false,
            readyChange: null,
            readyAdd: null,
            NewAddressTitle: null,
            checked: false,
            ForDelete: null,
            addresses: null,
            Address: null,
            ForEdit: null,
            ChangeCoords: null,
            latitude: null,
            longitude: null,
        }
    }
    componentDidMount() {
        this.setState({
            addresses: this.props.addresses
        })
        return getCurrentPosition().then(position => {
            if (position) {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            }
        })
    }
    componentWillMount() {
        this.getFavorite()
    }
    getFavorite = () => {
        if (this.props.Token && this.props.passenger_id !== null) {
            var thiss = this;
            axios.post('passenger/addresses', {
                token: thiss.props.Token,
                passenger_id: thiss.props.PassengerId
            }).then(function (response) {
                if (response.data.is_successful) {
                    thiss.setState({
                        addresses: response.data.data
                    })
                } else {
                }
            }).catch(function (error) {
            })
        } else {
            setTimeout(() => {
                this.getFavorites()
            }, 2000)
        }
    }
    _selectedHandler = item => {
        this.setState({
            selectedFav: item,
            Page: 'item'
        })
    }
    _setFavorite(coords) {
        this.setState({
            latitude: coords.latitude,
            longitude: coords.longitude,
            checked: true,
        })
    }
    _Toggle = () => {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            Page: 'main'
        })
    }
    _DeleteAddress = () => {
        var that = this
        Axios.post('passenger/address/delete', {
            token: that.props.Token,
            passenger_id: that.props.PassengerId,
            id: that.state.ForDelete.id,
        }).then(function (response) {
            if (response.data.is_successful) {
                that.getFavorite()
                that.setState({
                    isModalVisible: false,
                    Page: 'main'
                })
            } else {
                alert(response.data.message)
                that.setState({
                    Page: 'main',
                    isModalVisible: false
                })
            }
        }).catch(function (err) {
            that.setState({
                Page: 'main',
                isModalVisible: false
            })
        })
    }
    _DeleteAddressBefore = (item) => {
        this.setState({
            ForDelete: item,
            Page: 'SureForDelete',
            isModalVisible: true,
        })
    }
    _EditAddress = item => {
        this.setState({
            ForEdit: item,
            Page: 'Edit'
        })
    }
    _ChagePinLocation = (e) => {
        this.setState({
            readyChange: e.nativeEvent.coordinate,
            ChangeCoords: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                latitudeDelta: 0.0500,
                longitudeDelta: 0.0500,
            }
        })
    }
    _SubmitChange = () => {
        var that = this;
        Axios.post('passenger/address', {
            token: that.props.Token,
            passenger_id: that.props.PassengerId,
            id: that.state.ForEdit.id,
            title: that.state.ForEdit.title,
            latitude: that.state.readyChange === null ? that.state.ForEdit.latitude : that.state.readyChange.latitude,
            longitude: that.state.readyChange === null ? that.state.ForEdit.longitude : that.state.readyChange.longitude,
        }).then(function (response) {
            if (response.data.is_successful) {
                that.getFavorite()
                that.setState({
                    isModalVisible: false,
                    Page: 'main'
                })
            } else {
                alert(response.data.message)
                that.setState({
                    Page: 'main',
                    isModalVisible: false
                })
            }
        }).catch(function (err) {
            that.setState({
                Page: 'main',
                isModalVisible: false
            })
        })
    }
    _AddNewAddress = (e) => {
        this.setState({
            readyAdd: e,
            latitude: e.latitude,
            longitude: e.longitude,
        })
    }
    _AddNewAddress2 = (data) => {
        this.setState({
            readyAdd: data.geometry.location,
            latitude: data.geometry.location.lat,
            longitude: data.geometry.location.lng,
            Address: data.formatted_address,
            Page: 'addnewaddress'
        })
    }
    _SubmitNew = () => {
        if (this.state.NewAddressTitle) {
            var that = this;
            let latitude
            let longitude
            if (that.state.readyAdd && that.state.readyAdd.latitude) latitude = that.state.readyAdd.latitude
            if (that.state.readyAdd && that.state.readyAdd.lat) latitude = that.state.readyAdd.lat
            if (that.state.latitude) latitude = that.state.latitude
            if (that.state.readyAdd && that.state.readyAdd.longitude) longitude = that.state.readyAdd.longitude
            if (that.state.readyAdd && that.state.readyAdd.lng) longitude = that.state.readyAdd.lng
            if (that.state.longitude) longitude = that.state.longitude
            Axios.post('passenger/address', {
                token: that.props.Token,
                passenger_id: that.props.PassengerId,
                title: that.state.NewAddressTitle,
                latitude: latitude,
                longitude: longitude
            }).then(function (response) {
                if (response.data.is_successful) {
                    that.getFavorite()
                    that.setState({
                        Page: 'main',
                        NewAddressTitle: null,
                    })
                    that.getFavorite()
                } else {
                    alert(response.data.message)
                }
            }).catch(function (err) {
            })
        } else {
            alert('fill address title')
        }
    }
    render() {
        switch (this.state.Page) {
            case 'search':
                return (
                    <View style={styles.Container}>
                        <TopBar title="جستجو" leftIcon="back" ShowMenu={() => this.setState({ Page: 'addnewaddress' })} />
                        <GooglePlacesAutocomplete
                            placeholder='جستجو'
                            minLength={2} // minimum length of text to search
                            autoFocus={true}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                            listViewDisplayed='auto'    // true/false/undefined
                            fetchDetails={true}
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                this._AddNewAddress2(details)
                            }}

                            getDefaultValue={() => ''}

                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyBZ2aQnzxcjjvcLjD6I6LEpbuE7kNMbvN4',
                                language: 'en', // language of the results
                                types: 'address' // default: 'geocode'
                            }}

                            styles={{
                                textInputContainer: {
                                    width: '100%'
                                },
                                description: {
                                    fontFamily:"Medium",
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                }
                            }}

                            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                            //   currentLocationLabel="Current location"
                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            }}
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                type: 'address'
                            }}

                            GooglePlacesDetailsQuery={{
                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                fields: 'formatted_address',
                            }}

                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                            // predefinedPlaces={newarray}

                            debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                        />
                    </View>
                )
                break;
            case 'Edit':
                let Region2 = { latitude: parseFloat(this.state.ForEdit.latitude), longitude: parseFloat(this.state.ForEdit.longitude), latitudeDelta: 0.0500, longitudeDelta: 0.0500 };
                let text = this.state.ForEdit.title;
                return (
                    <View style={{ flex: 1 }}>
                        <TopBar title="ویرایش" leftIcon="back" ShowMenu={() => this.setState({ Page: 'main' })} />
                        <TextInput
                            value={this.state.ForEdit.title}
                            onChangeText={(val) => this.setState({ ForEdit: { ...this.state.ForEdit, title: val } })}
                            style={{ marginVertical: 15, width: width / 10 * 9, alignSelf: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#656565", textAlign: 'center' }}
                            placeholder="تیتر"
                            placeholderTextColor="#202020"
                        />
                        <MapView
                            region={this.state.ChangeCoords !== null ? this.state.ChangeCoords : Region2}
                            style={{ flex: 1 }}
                        >
                            {this.state.ForEdit ?
                                <Marker
                                    coordinate={{
                                        latitude: parseFloat(this.state.ForEdit.latitude),
                                        longitude: parseFloat(this.state.ForEdit.longitude)
                                    }}
                                    draggable={true}
                                    onDragEnd={(e) => this._ChagePinLocation(e)}
                                /> :
                                null}
                        </MapView>
                        <TouchableOpacity onPress={() => this._SubmitChange()} style={{ backgroundColor: '#ffffff', padding: 10, borderRadius: 30, alignSelf: 'center' }}>
                            <Text style={{ textAlign: 'center' , fontFamily:"Medium", }}>
                                ثبت
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
                break;
            case 'SureForDelete':
                return (
                    <View style={{ flex: 1 }}>
                        <TopBar title="حذف" leftIcon="back" ShowMenu={() => this.setState({ Page: 'main' })} />
                        <Modal isVisible={this.state.isModalVisible}>
                            <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 16, marginBottom: 15 , fontFamily:"Medium", }}>
                                    مطمئنی?
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this._DeleteAddress()} style={{ backgroundColor: '#2a2e43', paddingVertical: 10, borderRadius: 10, width: width / 10 * 4, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: "#fff", fontSize: 15, textAlign: 'center' , fontFamily:"Medium", }}>
                                            بله
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this._Toggle()} style={{ width: width / 10 * 4, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 15, fontFamily:"Medium" , textAlign: 'center' }}>
                                            خیر
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                )
                break;
            case 'item':
                let Region = { latitude: this.state.selectedFav.geometry.location.lat, longitude: this.state.selectedFav.geometry.location.lng, latitudeDelta: 0.0500, longitudeDelta: 0.0500 }
                return (
                    <View style={{ flex: 1 }}>
                        <TopBar title="آدرس موردعلاقه" leftIcon="back" ShowMenu={() => this.setState({ Page: 'main' })} />
                        <MapView
                            region={Region}
                            style={{ flex: 1 }}
                        >
                            {this.state.selectedFav ?
                                <Marker coordinate={{ latitude: this.state.selectedFav.geometry.location.lat, longitude: this.state.selectedFav.geometry.location.lng }} onPress={(e) => this._setFavorite(e.nativeEvent.coordinate)} /> :
                                null}
                        </MapView>
                    </View>
                )
                break;
            case 'addnewaddress':
                let CurrentPosition = { latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: 0.0400, longitudeDelta: 0.0400 }
                return (
                    <View style={{ flex: 1 }}>
                        <TopBar title="آدرس مورد علاقه" leftIcon="back" ShowMenu={() => this.setState({ Page: 'main' })} />
                        <TextInput
                            value={this.state.NewAddressTitle}
                            onChangeText={(val) => this.setState({ NewAddressTitle: val })}
                            style={{ marginVertical: 15, width: width / 10 * 9, alignSelf: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#656565", textAlign: 'center' }}
                            placeholder="تیتر"
                            placeholderTextColor="#202020"
                        />
                        {/* <TouchableOpacity onPress={() => this.setState({ Page: 'search' })} style={{ width: width - 60, alignSelf: 'center', backgroundColor: '#2a2e43', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center',fontFamily:"Medium", color: 'white' }}>
                                جستحو
                            </Text>
                        </TouchableOpacity> */}
                        {this.state.Address !== null ? <View>
                            <Text style={{ flexWrap: 'wrap', paddingHorizontal: 10,fontFamily:"Medium", marginVertical: 10 }}>آدرس: {this.state.Address}</Text>
                        </View> : null}
                        <MapView
                            region={CurrentPosition}
                            style={{ flex: 1 }}
                        >
                            <Marker
                                image={require('../assets/push-pin2.png')}
                                style={{ width: 42, height: 42 }}
                                coordinate={CurrentPosition}
                                onDragEnd={(e) => this._AddNewAddress(e.nativeEvent.coordinate)}
                                draggable={true}
                            />
                        </MapView>
                        <TouchableOpacity onPress={() => this._SubmitNew()} style={{ backgroundColor: '#ffffff', padding: 10, borderRadius: 30, alignSelf: 'center' }}>
                            <Text style={{ textAlign: 'center' , fontFamily:"Medium", }}>
                                ثبت
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
                break;
            default:
                return (
                    <View style={styles.container}>
                        <TopBar title="لیست آدرس های موردعلاقه" leftIcon="back" ShowMenu={this.props.ShowMenu} />
                        <TouchableOpacity style={{ marginVertical: 15, width: width / 10 * 9, alignSelf: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#656565" }} onPress={() => this.setState({ Page: 'addnewaddress' })}>
                            <Text style={{ textAlign: 'center' , fontFamily:"Medium" }}>
                                افزودن جدید
                                </Text>
                        </TouchableOpacity>
                        <ScrollView>
                            {this.state.addresses !== null ? this.state.addresses.map(item => {
                                return (
                                    <TouchableOpacity key={item.id} style={styles.Row} onPress={() => this._selectedHandler(item)}>
                                        <Text style={{fontFamily:"Medium"}}>
                                            {item.title}
                                        </Text>
                                        <View style={styles.col2}>
                                            <TouchableOpacity style={styles.button} onPress={() => this._EditAddress(item)}>
                                                <Image source={require('../assets/edit2.png')} style={{ width: 22, height: 22 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.button} onPress={() => this._DeleteAddressBefore(item)}>
                                                <Image source={require('../assets/delete.png')} style={{ width: 22, height: 22 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }) : null}
                        </ScrollView>
                    </View>
                )
                break;
        }
    }
}
const styles = StyleSheet.create({
    container: {

    },
    Row: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#707070',
        padding: 20,
        marginBottom: 15,
    },
    col2: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    button: {
        marginLeft: 5,
        marginRight: 5,
    }
})
const { width } = Dimensions.get('window');
export default Favorite;