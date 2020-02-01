import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  AsyncStorage,
    ActivityIndicator,
  StatusBar
} from 'react-native';
import axios from 'axios';
import IntroScreen from './Components/IntroScreen';
import MainSignInUpView from './Components/MainSignInUpView';
import Home from './Components/Home';
import AppLoadingScreen from './Components/Loading';
import * as Font from 'expo-font';
axios.defaults.baseURL = 'http://panel.taximasir.com/api/';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      LogPhone: null,
      LogPassword: null,
      isFontLoaded:false,
      Token: null,
      FullData: null,
      isLog: false,
      logged: '0',
      passenger_id: null,
      wasNotLogin: false,
      CanLogin: false,
      oldStatus: null,
      Intervals: [],
    }
  }
  componentDidMount(){
    Font.loadAsync({
      'Black':require('./assets/Fonts/IRANSansWeb_Black.ttf'),
      'Bold':require('./assets/Fonts/IRANSansWeb_Bold.ttf'),
      'Light':require('./assets/Fonts/IRANSansWeb_Light.ttf'),
      'Medium':require('./assets/Fonts/IRANSansWeb_Medium.ttf'),
      'UltraLight':require('./assets/Fonts/IRANSansWeb_UltraLight.ttf'),
      'Iran':require('./assets/Fonts/IRANSansWeb.ttf'),
    })
    this.setState({
      isFontLoaded:true
    })
  }
  componentWillMount() {
    this.getMyValue()
  }
  getMyValue = async () => {
    const passenger_id = await AsyncStorage.getItem('passenger_id');
    const image = await AsyncStorage.getItem('image');
    const token = await AsyncStorage.getItem('token');
    const phone = await AsyncStorage.getItem('phone');
    const name = await AsyncStorage.getItem('name');
    const email = await AsyncStorage.getItem('email');
    const logged = await AsyncStorage.getItem('logged');
    const pushToken = await AsyncStorage.getItem('push_token');
    this.setState({
      logged: logged,
      FullData: {
        token: token,
        phone_number: phone,
        passenger_id: passenger_id,
        image_url: image,
        full_name: name,
        email: email,
        push_token: pushToken,
      }
    });
    if (token !== null && passenger_id !== null) {
      this._CheckToken()
    } else {
      this.setState({
        wasNotLogin: true
      });
      this.logout()
    }
  };
  Status = (data) => {
    this.statusFromServer()
  };
  statusFromServer = () => {
    console.log("status");
    var that = this;
    axios.post('passenger/status', {
      passenger_id: that.state.FullData.passenger_id,
      token: that.state.FullData.token,
    }).then(function (response) {
      if (response.data.is_successful) {
        if (response.data.data.has_trip === 1) {
          that.setState({
            loading: false,
            oldStatus: response.data.data
          })
        }
      } else {
        setTimeout(() => {
          that.Status(true)
        }, 15000);
      }
    }).catch(function (err) {
    })
  };
  _CheckToken = () => {
    var that = this;
    axios.post('verify_token', {
      passenger_id: that.state.FullData.passenger_id,
      token: that.state.FullData.token,
    }).then(function (response) {
      if (response.data.is_successful) {
        that.setState({
          loading: false,
          isLog: true,
          logged: '1'
        });
        that.Status(true)
      } else {
        that.logout()
      }
    }).catch(function (err) {
    })
  };
  checkSend = async (data) => {
    try{
      await AsyncStorage.setItem("token" , data.token)
      await AsyncStorage.setItem("logged" , "1")
      await AsyncStorage.setItem("passenger_id",data.passenger_id.toString())
      if(data.image_url) await AsyncStorage.setItem("image",data.image_url)
      await AsyncStorage.setItem("phone",data.phone_number)
      await AsyncStorage.setItem("name",data.full_name)
      if(data.email) await AsyncStorage.setItem("email",data.email)
      if(data.referrer_code) await AsyncStorage.setItem("refferCode",data.referrer_code)
    } catch (e) {
      console.log(e)
    }
  };

  logout = async () => {
    await AsyncStorage.clear();
    this.setState({
      isLog: false,
      loading: false,
      FullData: null,
      logged: '0',
    })
  };
  logout2 = async () => {
    var thiss = this;
    axios.post('passenger', {
      token: this.state.FullData.token,
      passenger_id: this.state.FullData.passenger_id,
    }).then(function (response) {
      if (response.data.is_successful) {
        thiss.setState({
          FullData: response.data.data
        });
        thiss.checkSend(response.data.data)
      } else {
        alert(response.data.message)
      }
    }).catch(function (error) {
    })
  };
  mago = () => {
    this.setState({
      CanLogin: true
    });
    var thiss = this;
    axios.post('login', {
      phone_number: this.state.LogPhone,
      password: this.state.LogPassword,
    }).then(function (response) {
      if (response.data.is_successful === true) {
        AsyncStorage.setItem('isLoggedIn', '1');
        AsyncStorage.setItem('password', thiss.state.LogPassword);
        thiss.setState({
          FullData: response.data.data,
          logged: '1',
          CanLogin: false,
        });
        thiss.checkSend(response.data.data)
      } else {
        thiss.setState({
          CanLogin: false
        });
        alert(response.data.message)
      }
    }).catch(function (error) {
      thiss.setState({
        CanLoginL: false
      });
    })
  };
  GoToLogin = () => {
    this.setState({ isLog: true });
  };
  render() {
    if (this.state.loading) {
      return (
          <AppLoadingScreen />
      )
    }
    if (this.state.logged === '1') {
      return <View style={{ height: height, width: width, marginTop: StatusBar.currentHeight, position: 'relative', }}>
        <StatusBar backgroundColor="#2a2e43" />
        {this.state.isFontLoaded ? <Home
            oldData={this.state.oldStatus}
            fullData={this.state.FullData}
            Logout2={() => this.logout2()}
            logout={() => this.logout()}
            Status={(data) => this.Status(data)}
        /> : <ActivityIndicator size={"large"} size={"#2a2e43"}/>}
      </View>
    }
    if (this.state.isLog === true) {
      return (
          <>
          {this.state.isFontLoaded ? <MainSignInUpView
                CanLogin={this.state.CanLogin}
                LogPhoneVal={this.state.LogPhone}
                phoneCh={(phone) => this.setState({LogPhone:phone})}
                LogPassword={(pass) => this.setState({ LogPassword: pass })}
                LogPasswordVal={this.state.LogPassword}
                SendLogRequest={() => this.mago()}
            /> : <ActivityIndicator size={"large"} color={"#2a2e43"}/>}
            </>
      )
    }
    if (this.state.isLog === false) {
      return (
          <>
            {this.state.isFontLoaded ? <IntroScreen
                IntroClick={() => this.GoToLogin()}
            /> : <ActivityIndicator size={"large"} color={"#2a2e43"}/>}
          </>
      )
    }
  }
}
var { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  text: {
    marginTop: 20,
    marginLeft: 15,
    fontWeight: '400',
    fontSize: 28
  },
  description: {
    fontSize: 18,
    color: "#707070",
    marginLeft: 20
  },
  image: {
    marginTop: 50,
    width: width,
    height: width / 5 * 4
  }
})

export default App;