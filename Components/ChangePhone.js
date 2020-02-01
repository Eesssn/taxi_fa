import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import TopBar from './TopBar';

const { width } = Dimensions.get('window');

class ChangeName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <View>
                <TopBar title="تغییر شماره موبایل" leftIcon="back" ShowMenu={this.props.ShowMenu} />
                <View style={styles.Container}>
                    <Text style={styles.header}>
                        {this.props.phone}
                    </Text>
                    <TextInput
                        style={styles.field}
                        value={this.props.Phone}
                        onChangeText={this.props.ChangePhone}
                        keyboardAppearance="light"
                        placeholder="شماره تماس"
                        autoFocus={true}
                        autoCapitalize="none"
                        autoCorrect={true}
                        keyboardType="phone-pad"
                        returnKeyType="done"
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity style={styles.button} onPress={this.props.savePhone}>
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