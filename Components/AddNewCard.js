import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import TopBar from './TopBar';

class AddNewCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardno1: '',
            cardno2: '',
            cardno3: '',
            cardno4: '',
            cardHolder: '',
            cardDate: '',
            cardpassword: '',
            cvv: '',
            cardYear: '',
            cardMonth: '',
            completeCard: '',
            cardInfo: '',
            name: '',
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <TopBar title="افزودن کارت جدید" leftIcon="back" ShowMenu={this.props.back} />
                <View style={styles.container}>
                    <View style={styles.imageHolder}>
                        <Image source={require('../assets/Card.png')} style={styles.imageView} />
                        <View style={styles.cardHolder}>
                            <Text style={styles.cardno}>{this.state.cardno1}</Text>
                            <Text style={styles.cardno}>{this.state.cardno2}</Text>
                            <Text style={styles.cardno}>{this.state.cardno3}</Text>
                            <Text style={styles.cardno}>{this.state.cardno4}</Text>
                        </View>
                    </View>
                    <View style={styles.nameHolder}>
                        <Text style={styles.nameValue}>
                            {this.state.name}
                        </Text>
                    </View>
                    <View style={styles.dateHolder}>
                        <Text style={styles.dateValue}>
                            {this.state.cardDate}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.cardInput}
                            value={this.state.cardno1}
                            onChangeText={(cardno1) => this.setState({ cardno1 })}
                            placeholder="XXXX"
                            placeholderTextColor="#00000050"
                            maxLength={4}
                            keyboardType={'number-pad'}
                            onSubmitEditing={() => { this.cardno2.focus(); }}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            style={styles.cardInput}
                            value={this.state.cardno2}
                            onChangeText={(cardno2) => this.setState({ cardno2 })}
                            placeholder="XXXX"
                            placeholderTextColor="#00000050"
                            maxLength={4}
                            keyboardType={'number-pad'}
                            onSubmitEditing={() => { this.cardno3.focus(); }}
                            blurOnSubmit={false}
                            ref={(input) => { this.cardno2 = input; }}
                        />
                        <TextInput
                            style={styles.cardInput}
                            value={this.state.cardno3}
                            onChangeText={(cardno3) => this.setState({ cardno3 })}
                            placeholder="XXXX"
                            placeholderTextColor="#00000050"
                            maxLength={4}
                            keyboardType={'number-pad'}
                            onSubmitEditing={() => { this.cardno4.focus(); }}
                            blurOnSubmit={false}
                            ref={(input) => { this.cardno3 = input; }}
                        />
                        <TextInput
                            style={styles.cardInput}
                            value={this.state.cardno4}
                            onChangeText={(cardno4) => this.setState({ cardno4 })}
                            placeholder="XXXX"
                            placeholderTextColor="#00000050"
                            maxLength={4}
                            onBlur={() => this.setState({
                                completeCard: this.state.cardno1 +
                                    this.state.cardno2 +
                                    this.state.cardno3 +
                                    this.state.cardno4
                            })}
                            keyboardType={'number-pad'}
                            ref={(input) => { this.cardno4 = input; }}
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            value={this.state.name}
                            onChangeText={(name) => this.setState({ name })}
                            placeholder="نام"
                            style={styles.nameInput}
                            placeholderTextColor="#00000050"
                            keyboardAppearance="light"
                            keyboardType="default"
                            autoCapitalize="words"
                            autoCompleteType="name"
                            autoCorrect={true}
                        />
                        <View style={styles.dateContainer}>
                            <TextInput
                                style={styles.cardDateInput}
                                value={this.state.cardMonth}
                                onChangeText={(cardMonth) => this.setState({ cardMonth })}
                                placeholder="MM"
                                maxLength={2}
                                placeholderTextColor="#00000050"
                                keyboardType={'number-pad'}
                            />
                            <TextInput
                                style={styles.cardDateInput}
                                value={this.state.cardYear}
                                onChangeText={(cardYear) => this.setState({ cardYear })}
                                placeholder="YY"
                                maxLength={2}
                                onBlur={() => this.setState({
                                    cardDate: [this.state.cardMonth, this.state.cardYear],
                                    cardInfo: [
                                        this.state.cardHolder,
                                        this.state.completeCard,
                                        [this.state.cardMonth, this.state.cardYear],
                                        this.state.cardpassword,
                                        this.state.cvv]
                                })}
                                placeholderTextColor="#00000050"
                                keyboardType={'number-pad'}
                            />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.cardPasswordInput}
                            value={this.state.cardpassword}
                            onChangeText={(cardpassword) => this.setState({ cardpassword })}
                            placeholder="رمز"
                            placeholderTextColor="#00000050"
                            keyboardType={'number-pad'}
                        />
                        <TextInput
                            style={styles.cardCVVInput}
                            secureTextEntry={true}
                            value={this.state.cvv}
                            maxLength={4}
                            onChangeText={(cvv) => this.setState({ cvv })}
                            placeholder="CVV"
                            placeholderTextColor="#00000050"
                            keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>
                            تایید کارت
                  </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
var { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    imageHolder: {
        position: 'relative',
        alignItems: 'center'
    },
    imageView: {
        width: width / 10 * 8,
        marginTop: 20,
        height: height / 4,
        borderRadius: 15,
    },
    cardHolder: {
        fontFamily:"Medium",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 80
    },
    cardno: {
        fontFamily:"Medium",
        marginLeft: 5,
        marginRight: 5,
        color: "#fff",
        fontSize: 18
    },
    nameHolder: {
        fontFamily:"Medium",
        position: 'absolute',
        bottom: 20,
        left: 50
    },
    nameValue: {
        fontFamily:"Medium",
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold'
    },
    dateHolder: {
        position: 'absolute',
        bottom: 20,
        right: 70
    },
    dateValue: {
        fontFamily:"Medium",
        color: "#fff",
        fontSize: 16
    },
    nameInput: {
        fontFamily:"Medium",
        borderColor: '#707070',
        borderWidth: 1,
        backgroundColor: '#d7d7d7',
        borderRadius: 10,
        width: width / 100 * 60,
        padding: 15,
    },
    cardDateInput: {
        fontFamily:"Medium",
        borderColor: '#707070',
        borderWidth: 1,
        backgroundColor: '#d7d7d7',
        borderRadius: 10,
        width: width / 100 * 15,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 3,
        marginRight: 3,
        textAlign: 'center'
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
    },
    cardPasswordInput: {
        fontFamily:"Medium",
        borderColor: '#707070',
        borderWidth: 1,
        backgroundColor: '#d7d7d7',
        borderRadius: 10,
        width: width / 100 * 70,
        padding: 15,
    },
    cardCVVInput: {
        fontFamily:"Medium",
        textAlign: 'center',
        borderColor: '#707070',
        borderWidth: 1,
        backgroundColor: '#d7d7d7',
        borderRadius: 10,
        width: width / 100 * 20,
        padding: 15,
    },
    cardInput: {
        fontFamily:"Medium",
        borderColor: '#707070',
        borderWidth: 1,
        backgroundColor: '#d7d7d7',
        borderRadius: 10,
        width: width / 100 * 23,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: width / 100 * 60,
        padding: 15,
        borderRadius: 50,
        backgroundColor: '#2a2e43',
    },
    buttonText: {
        fontFamily:"Medium",
        textAlign: 'center',
        color: '#ffffff',
    }
})
export default AddNewCard;