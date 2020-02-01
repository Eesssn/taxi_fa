import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  Picker,
  ActivityIndicator
} from "react-native";
import TimePicker from "react-native-datepicker";
import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";

class LoginFirstStep extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.inputContainer}>
          <View>
            <KeyboardAvoidingView enabled={true} behavior="padding">
              <TextInput
                style={styles.input}
                value={this.props.Fullname}
                onChangeText={this.props.FullnameCh}
                placeholder="نام"
                autoCompleteType="name"
                autoCapitalize="words"
                placeholderTextColor="#ffffff50"
              />
              <TextInput
                style={styles.input}
                value={this.props.Phone}
                onChangeText={this.props.phoneCh}
                placeholder="شماره تماس"
                placeholderTextColor="#ffffff50"
                keyboardType="phone-pad"
              />
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={this.props.Password}
                onChangeText={this.props.PasswordCh}
                placeholder="رمز عبور"
                placeholderTextColor="#ffffff50"
              />
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={this.props.Repass}
                onChangeText={this.props.RepassCh}
                placeholder="تکرار رمزعبور"
                placeholderTextColor="#ffffff50"
              />
              <View style={{ flexDirection: "row" }}>
                <Picker
                  selectedValue={this.props.Sex}
                  style={styles.selectOption}
                  onValueChange={this.props.SexCh}
                >
                  <Picker.Item label="مرد" value="1" />
                  <Picker.Item label="زن" value="0" />
                  <Picker.Item label="سایر" value={null} />
                </Picker>
              </View>
            </KeyboardAvoidingView>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://vistaapp.ir");
                }}
              >
                <Text style={{ color: "#CED0CE", fontFamily: "Medium" }}>
                  قوانین و مقررات
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={this.props.policy}
              style={{ flexDirection: "row" }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 15,
                  marginRight: 15,
                  borderRadius: 10,
                  borderColor: "white",
                  borderWidth: 0.5,
                  backgroundColor: this.props.policycolor
                }}
              />
              <Text style={{ color: "white", fontFamily: "Medium" }}>
                قبول میکنم.
              </Text>
            </TouchableOpacity>
          </View>
          {this.props.CanGo ? (
            <ActivityIndicator size={"large"} color={"white"} />
          ) : (
            <TouchableOpacity
              style={styles.enterBtn}
              onPress={this.props.CheckRequest}
            >
              <Text style={styles.enterBtnText}>مرحله بعد</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }
}
var { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  input: {
    fontFamily: "Medium",
    writingDirection: "rtl",
    textAlign: "right",
    color: "#fff",
    borderBottomColor: "#fff",
    borderBottomWidth: 1.5,
    width: (width / 6) * 4,
    marginBottom: 5,
    padding: 10,
    fontSize: 20
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
    paddingBottom: 30
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
  },
  radioContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row"
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
    marginTop: 7
  },
  selectOption: {
    width: (width / 6) * 4,
    height: 70,
    color: "#ffffff"
  }
});
export default LoginFirstStep;
