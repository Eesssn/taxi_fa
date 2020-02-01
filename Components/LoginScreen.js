import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.props.LogPhoneVal}
            onChangeText={this.props.phoneCh}
            placeholder="شماره تماس"
            placeholderTextColor="#ffffff50"
            keyboardType="phone-pad"
          />
          {/* <PhoneInput
                        style={styles.input}
                        onChangePhoneNumber={this.props.phoneCh}
                        placeholder="شماره تلفن"
                        textStyle={{color:'#fff'}}
                        value={this.props.LogPhoneVal}
                        initialCountry={'ir'}
                        ref={this.props.refrence}
                        onPressFlag={this.props.onPressFlag}
                    />
                    <CountryPicker
                      ref={this.props.conRefrence}
                      onChange={this.props.selectCountry}
                      translation="eng"
                      cca2={this.props.cca2}
                    >
                      <View />
                    </CountryPicker> */}
          <TextInput
            secureTextEntry={true}
            ref={input => {
              this.password = input;
            }}
            style={styles.input}
            value={this.props.LogPasswordVal}
            onChangeText={this.props.LogPassword}
            placeholder="رمز عبور"
            placeholderTextColor="#ffffff50"
            onSubmitEditing={this.props.SendLogRequest}
          />
          {this.props.CanLogin ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <TouchableOpacity
              style={styles.enterBtn}
              onPress={this.props.SendLogRequest}
            >
              <Text style={styles.enterBtnText}>ورود</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
var { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  input: {
    fontFamily: "Medium",
    color: "#fff",
    borderBottomColor: "#fff",
    borderBottomWidth: 1.5,
    width: (width / 6) * 4,
    marginBottom: 20,
    padding: 10,
    fontSize: 20
  },
  inputContainer: {
    flex: 1,
    position: "relative",
    top: height / 4,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  enterBtn: {
    width: (width / 3) * 2,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginTop: 20
  },
  enterBtnText: {
    fontFamily: "Medium",
    textAlign: "center",
    color: "#2A2E43",
    marginTop: 13,
    fontSize: 20,
    fontWeight: "300"
  }
});
export default LoginScreen;
