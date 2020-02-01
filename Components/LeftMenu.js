import React, { Component } from 'react';
import {
  View,
  Dimensions ,
  BackHandler ,
  StyleSheet ,
  ScrollView ,
  TouchableOpacity,
  Image,
  Linking,
  Text,
} from 'react-native';
import LeftMenuView from './LeftMenuView';
import Settings from './Settings';
import Transaction from './TransactionActivity';
import HistoryView from './History';
import AboutView from './AboutUs';
import SupportView from './Support';
import Reserve from './Reserve';
import axios from 'axios';
var { width } = Dimensions.get('window');
const url = "https://vistaapp.ir"

class LeftMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      PrimaryMenu:true,
      showSetting:false,
      showHistory:false,
      showPayment:false,
      showLogout:false,
      showAbout:false,
      showSupport:false,
      showReserve:false,
      Cards:[],
      supports:[],
      Trips:[],
      ReserveData:[],
    };
  }

toggle(){
  this.setState({
    showSetting:true,
    PrimaryMenu:false,
  })
}

_ChangeView(){
  this.setState({
    showSetting:false,
    PrimaryMenu:true,
    showHistory:false,
    showLogout:false,
    showPayment:false,
    showAbout:false,
    showSupport:false,
    showReserve:false,
  })
}

_Transaction(){
  var thiss = this;
  axios.post('passenger/cards',{
    passenger_id:this.props.PassengerId,
    token:this.props.Token,
  }).then(function(response){
    if(response.data.is_successful){
      thiss.setState({
        Cards:response.data.data,
        showPayment:true,
        PrimaryMenu:false,
        showReserve:false,
      })
    } else {
      alert(response.data.message)
    }
  }).catch(function(err){
  })
}

_History(){
  var thiss = this;
  axios.post('passenger/trips',{
    passenger_id:this.props.PassengerId,
    token:this.props.Token,
    // filter: 'today' || 'week' || 'month' || 'last_month'
    // min_date : date,
    // max_date: date
  }).then(function(response){
    if(response.data.is_successful){
      thiss.setState({
        Trips:response.data.data,
        showHistory:true,
        PrimaryMenu:false,
        showReserve:false,
      })
    } else {
      alert(response.data.message)
    }
  }).catch(function(err){
  })
}

_Support(){
  var that = this;
  axios.post('questions',{
    passenger_id:this.props.PassengerId,
    token:this.props.Token,
  }).then(function(response){
    if(response.data.is_successful){
      that.setState({
        PrimaryMenu:false,
        supports:response.data.data,
        showSetting:false,
        showHistory:false,
        showPayment:false,
        showLogout:false,
        showReserve:false,
        showAbout:false,
        showSupport:true,
      })
    } else {
      alert(response.data.message)
    }
  }).catch(function(err){
  })
}
_Reserve(){
  var that = this;
  axios.post('passenger/reserves',{
    passenger_id:this.props.PassengerId,
    token:this.props.Token
  }).then(function(response){
    if(response.data.is_successful){
      that.setState({
        ReserveData:response.data.data,
        PrimaryMenu:false,
        showSetting:false,
        showHistory:false,
        showPayment:false,
        showLogout:false,
        showAbout:false,
        showReserve:true,
        showSupport:false,
      })
    } else {
      alert(response.data.message)
    }
  }).catch(function(err){
  })
}
_About(){
  this.setState({
    PrimaryMenu:false,
    showReserve:false,
    showSetting:false,
    showHistory:false,
    showPayment:false,
    showLogout:false,
    showAbout:true,
    showSupport:false,
  })
}
_openUrl(){
  Linking.openURL(url);
}
  render() {
    if(this.state.showSetting){
      return(
        <View style={styles.container}>
          <Settings
            logout={this.props.logout}
            getValuesFromAsync={this.props.getValuesFromAsync}
            fullData={this.props.fullData}
            Logout2={this.props.Logout2}
            Token={this.props.Token}
            PassengerId={this.props.PassengerId}
            ShowMenu={() => this._ChangeView()}
            Token={this.props.Token}
            PassengerId={this.props.PassengerId}
            Image={this.props.ImageUrl}
            Phone={this.props.Phone}
            Email={this.props.Email}
            Name={this.props.Name}
            addresses={this.props.addresses}
          />
        </View>
      )
    }
    if(this.state.showAbout){
      return(
        <View style={styles.secondaryContainer}>
          <AboutView ShowMenu={() => this._ChangeView()}/>
        </View>
      )
    }
    if(this.state.showSupport){
      return(
        <View style={styles.secondaryContainer}>
          <SupportView
            passenger_id={this.props.PassengerId}
            token={this.props.Token}
            data={this.state.supports}
            ShowMenu={() => this._ChangeView()}
          />
        </View>
      )
    }
    if(this.state.showHistory){
      return(
        <View style={styles.secondaryContainer}>
          <HistoryView
            PassengerId={this.props.PassengerId}
            Token={this.props.Token}
            ShowMenu={() => this._ChangeView()}
            Trips={this.state.Trips}
          />
        </View>
      )
    }
    if(this.state.showPayment){
      return(
        <View style={styles.secondaryContainer}>
          <Transaction
            Name={this.props.Name}
            ShowMenu={() => this._ChangeView()}
            Cards={this.state.Cards}
            Token={this.props.Token}
            PassengerId={this.props.PassengerId}
          />
        </View>
      )
    }
    if(this.state.showLogout){
      return(
        <View style={styles.secondaryContainer}>
          <Logout />
        </View>
      )
    }
    if(this.state.showReserve){
      return(
        <View>
          <Reserve
            PassengerId={this.props.PassengerId}
            Token={this.props.Token}
            ShowMenu={() => this._ChangeView()}
            Data={this.state.ReserveData}
          />
        </View>
      )
    }
    if(this.state.PrimaryMenu){
      return(
        <View style={styles.container}>
          <TouchableOpacity style={styles.first} onPress={this.props.HideMenu}>
            <Image source={require('../assets/left-arrow.png')} style={styles.headerImage} />
          </TouchableOpacity>
          <ScrollView>
            <LeftMenuView
              ReferrerCode={this.props.ReferrerCode}
              logout={this.props.logout}
              HideMenu={this.props.HideMenu}
              Name={this.props.Name}
              Phone={this.props.Phone}
              fullData={this.props.fullData}
              ImageUrl={this.props.ImageUrl}
              SettingToggle={() => this.toggle()}
              Transaction={() => this._Transaction()}
              History={() => this._History()}
              Support={() => this._Support()}
              Reserve={() => this._Reserve()}
              About={() => this._About()}
            />
          </ScrollView>
          <TouchableOpacity onPress={() => this._openUrl()} style={styles.link}>
            <Text style={styles.CopyRightText}>
              Designed By Vistaapp Company
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  headerImage:{
    transform:[{rotate:"180deg"}]
  },
  first: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex:999,
  },
  container:{ 
    flex: 1, 
    backgroundColor: "#2A2E43", 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    flexDirection: 'column' , 
    width:width , 
    position:'relative',
    paddingBottom:15,
    marginBottom:12,
   },
   secondaryContainer:{
    flex: 1, 
    backgroundColor:"#fff",
    alignItems:'center',
    justifyContent:'flex-start',
    flexDirection:'column',
    width:width,
    position:'relative'
   },
   CopyRightText:{
     color:'#3b415e',
     fontSize:10
   }
})

export default LeftMenu;