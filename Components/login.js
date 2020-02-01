import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import LoginScreen from './LoginScreen';
import Forgetpass from './Forgetpass';
import SwitchMenuHeader from './SwitchMenuHeader';

var { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    forgetPass: {
        width: width / 3 * 2,
        height: 60,
        borderRadius: 30,
        backgroundColor: "transparent",
        marginTop: 20
    },
    forgetPassText: {
        fontFamily:"Medium",
        textAlign: "center",
        color: "#FFF",
        marginTop: 13,
        fontSize: 20,
        fontWeight: '300'
    }
})

class Login extends Component {
    state = {
        showPage: false,
    }

    render() {

        const showToggle = !this.state.showPage;

        return (
            this.state.showPage
            ?
            <View style={{flex:1}}>
                <View style={{flex:2}}>
                </View>
                <View style={{flex:3}}>
                    <Forgetpass />
                </View>
                <View style={{flex:1,alignItems:'center',justifyContent:'flex-start'}}>
                    <TouchableOpacity onPress={() => this.setState({showPage:showToggle})}>
                        <Text style={{fontSize:18,fontFamily:"Medium",color:"#FFF"}}>
                            بازگشت به ورود
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            :
            <View style={{flex:1}}>
                <SwitchMenuHeader
                    renderResults={this.props.renderResults}
                    navigate="ثبت نام"
                />
                <View style={{ flex: 3 }}>
                    <LoginScreen
                        CanLogin={this.props.CanLogin}
                        SendLogRequest={this.props.SendLogRequest}
                        LogPassword={this.props.LogPassword}
                        LogPhoneVal={this.props.LogPhoneVal}
                        phoneCh={this.props.phoneCh}
                        refrence={this.props.refrence}
                        LogPasswordVal={this.props.LogPasswordVal}
                        conRefrence={this.props.conRefrence}
                        onPressFlag={this.props.onPressFlag}
                        selectCountry={this.props.selectCountry}
                        cca2={this.props.cca2}
                    />
                </View>
                <View style={{ flex: 2 , alignItems:'center' , justifyContent:'center' }}>
                    <TouchableOpacity 
                    style={styles.forgetPass}
                    onPress={() => this.setState({showPage:showToggle})}
                    >
                        <Text style={styles.forgetPassText}>
                            فراموشی رمز عبور
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Login;