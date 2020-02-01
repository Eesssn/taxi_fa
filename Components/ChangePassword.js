import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import TopBar from './TopBar';

const { width } = Dimensions.get('window');

class ChangeName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pass: '',
            newPass:''
        }
    }

    render() {
        return (
            <View>
                <TopBar title="تغییر رمز عبور" leftIcon="back" ShowMenu={this.props.ShowMenu}/>
                <View style={styles.Container}>
                    <TextInput
                        style={styles.field}
                        secureTextEntry={true}
                        value={this.props.oPass}
                        onChangeText={this.props.ChangeOPass}
                        keyboardAppearance="light"
                        placeholder="رمز عبور قبلی"
                        autoFocus={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="visible-password"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.newPass.focus(); }}
                    />
                    <TextInput
                        style={styles.field}
                        secureTextEntry={true}
                        onChangeText={this.props.ChangePass}
                        keyboardAppearance="light"
                        placeholder="رمز عبور جدید"
                        autoFocus={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.repeat.focus(); }}
                        ref={(input) => { this.newPass = input; }}
                    />
                    <TextInput
                        style={styles.field}
                        secureTextEntry={true}
                        onChangeText={this.props.ChangePass2}
                        keyboardAppearance="light"
                        placeholder="تکرار رمز عبور"
                        autoFocus={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        blurOnSubmit={false}
                        ref={(input) => { this.repeat = input; }}
                    />
                    <TouchableOpacity style={styles.button} onPress={this.props.savePass}>
                        <Text style={styles.buttonText}>
                            ثبت
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontFamily:"Medium",
        fontSize: 20,
        marginTop:30,
        marginBottom:30,
    },
    field: {
        fontFamily:"Medium",
        writingDirection:"rtl",
        textAlign:"right",
        borderColor: "#BDBDBD",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#F2F2F2',
        padding: 20,
        width: width / 100 * 90,
        marginBottom:20
    },
    button: {
        padding: 20,
        width: width / 100 * 90,
        borderRadius: 10,
        backgroundColor: '#2A2E43',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily:"Medium",
        textAlign: 'center',
        color: '#fff'
    },
})

export default ChangeName;