import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import TopBar from './TopBar';

const { width } = Dimensions.get('window');

class ChangeName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    render() {
        return (
            <View>
                <TopBar title="تغییر ایمیل" leftIcon="back" ShowMenu={this.props.ShowMenu} />
                <View style={styles.Container}>
                    <Text style={[styles.header, {fontFamily:"Medium",}]}>
                        {this.props.Email}
                    </Text>
                    <TextInput
                        style={styles.field}
                        value={this.props.Email}
                        onChangeText={this.props.ChangeEmail}
                        keyboardAppearance="light"
                        placeholder="آدرس ایمیل"
                        autoFocus={true}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.props.saveEmail}
                        // onPress={this.props.save}
                    >
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
        borderColor: "#BDBDBD",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#F2F2F2',
        padding: 20,
        width: width / 100 * 90,
        marginBottom:50
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