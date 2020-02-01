import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import Axios from 'axios';

class CardView extends Component {
    constructor(props) {

        super(props);
        this.state = {
            cardno1: '',
            cardno2: '',
            cardno3: '',
            cardno4: '',
            cardHolder: '',
            cardMonth: '',
            cardYear: '',
            cardCVV: '',
        }
    }
    submit = () => {
        var mago = this.state;
        var that = this;
        if (mago.cardCVV && mago.cardMonth && mago.cardYear && mago.cardno1 && mago.cardno2 && mago.cardno3 && mago.cardno4) {
            Axios.post('passenger/card', {
                card_number: mago.cardno1.toString() + mago.cardno2.toString() + mago.cardno3.toString() + mago.cardno4.toString(),
                expire_year: mago.cardYear,
                expire_month: mago.cardMonth,
                cvv: mago.cardCVV,
                passenger_id: that.props.PassengerId,
                token: that.props.Token,
            }).then(function (response) {
                if (response.data.is_successful) {
                    that.props.PageSwitcher()
                } else {
                    alert(response.data.message)
                }
            }).catch(function (e) {
            })
        } else {
            alert('fill all inputs')
        }
    }

    render() {
        return (
            <View style={{ flex: 1, marginTop: 10 }}>
                <View style={{ position: 'relative' }}>
                    <View style={styles.imageHolder}>
                        <Image source={require('../assets/cardHolder.png')} style={styles.imageView} />
                        <View style={styles.cardHolder}>
                            <Text style={styles.cardno}>{this.state.cardno1}</Text>
                            <Text style={styles.cardno}>{this.state.cardno2}</Text>
                            <Text style={styles.cardno}>{this.state.cardno3}</Text>
                            <Text style={styles.cardno}>{this.state.cardno4}</Text>
                        </View>
                    </View>
                    <View style={styles.dateHolder}>
                        <Text style={styles.dateValue}>
                            {this.state.cardMonth} / {this.state.cardYear}
                        </Text>
                    </View>
                </View>
                <View style={styles.BottomContainer}>
                    <KeyboardAvoidingView enabled={true} behavior="padding">
                        <View style={styles.CardNumberContainer}>
                            <TextInput
                                ref="1"
                                keyboardType="numeric"
                                style={styles.CardNumber}
                                value={this.state.cardno1}
                                placeholderTextColor="#8f8f8f"
                                placeholder="1234"
                                maxLength={4}
                                onChangeText={(value) => {
                                    if (this.state.cardno1.length == 3) {
                                        this.firstInput.focus()
                                    }
                                    this.setState({ cardno1: value })
                                }}
                            />
                            <TextInput
                                ref={(input) => { this.firstInput = input }}
                                keyboardType="numeric"
                                style={styles.CardNumber}
                                value={this.state.cardno2}
                                maxLength={4}
                                placeholderTextColor="#8f8f8f"
                                placeholder="1234"
                                onChangeText={(value) => {
                                    if (this.state.cardno2.length == 3) {
                                        this.secondInput.focus()
                                    }
                                    this.setState({ cardno2: value })
                                }}
                            />
                            <TextInput
                                ref={(input) => { this.secondInput = input }}
                                keyboardType="numeric"
                                style={styles.CardNumber}
                                value={this.state.cardno3}
                                placeholderTextColor="#8f8f8f"
                                placeholder="1234"
                                maxLength={4}
                                onChangeText={(value) => {
                                    if (this.state.cardno3.length == 3) {
                                        this.thirdInput.focus()
                                    }
                                    this.setState({ cardno3: value })
                                }}
                            />
                            <TextInput
                                ref={(input => this.thirdInput = input)}
                                keyboardType="numeric"
                                style={styles.CardNumber}
                                value={this.state.cardno4}
                                placeholderTextColor="#8f8f8f"
                                placeholder="1234"
                                maxLength={4}
                                onChangeText={(value) => {
                                    if (this.state.cardno4.length == 3) {
                                        this.forthInput.focus()
                                    }
                                    this.setState({ cardno4: value })
                                }}
                            />
                        </View>
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView behavior="padding" enabled={true}>
                        <View style={styles.CardDateContainer}>
                            <TextInput
                                ref={(input => this.forthInput = input)}
                                keyboardType="numeric"
                                style={styles.CardDate}
                                value={this.state.cardMonth}
                                placeholderTextColor="#8f8f8f"
                                placeholder="08"
                                onChangeText={(month) => {
                                    if (this.state.cardMonth.length == 1) {
                                        this.fifthInput.focus()
                                    }
                                    this.setState({ cardMonth: month })
                                }
                                }
                            />
                            <TextInput
                                keyboardType="numeric"
                                ref={(input => this.fifthInput = input)}
                                style={styles.CardDate}
                                placeholderTextColor="#8f8f8f"
                                placeholder="22"
                                value={this.state.cardYear}
                                onChangeText={(year) => {
                                    if(this.state.cardYear.length == 1){
                                        this.sixthInput.focus()
                                    }
                                    this.setState({ cardYear: year })
                                }}
                            />
                            <TextInput
                                ref={(input => this.sixthInput = input)}
                                keyboardType="number-pad"
                                style={styles.CardCVV}
                                value={this.state.cardCVV}
                                onChangeText={(cvv) => this.setState({ cardCVV: cvv })}
                                secureTextEntry={true}
                                placeholder="CVV"
                                placeholderTextColor="#8f8f8f"
                            />
                        </View>
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView behavior="padding" enabled={true}>
                        <View style={styles.CVVContainer}>
                            <TouchableOpacity onPress={() => this.submit()} style={styles.SubmitButton}>
                                <Text style={styles.SubmitButtonText}>
                                    ثبت
                                        </Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        )
    }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    BottomContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: width,
        paddingHorizontal: 10,
    },
    CardNameHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        width: width
    },
    CardName: {
        borderColor: '#2a2e43',
        borderWidth: 0.5,
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 7,
        textAlign: 'center',
        backgroundColor: '#e6e6e6',
        color: '#2a2e43',
        width: width - 40,
    },
    CardNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    CardNumber: {
        borderColor: '#2a2e43',
        borderWidth: 0.5,
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        color: '#2a2e43',
        textAlign: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 7,
        width: width / 100 * 20,
    },
    CardDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        width: width
    },
    CVVContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        width: width
    },
    CardDate: {
        textAlign: 'center',
        borderColor: '#2a2e43',
        borderWidth: 0.5,
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        color: '#2a2e43',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginHorizontal: 7,
        width: width / 100 * 20,
    },
    CardPassword: {
        borderColor: '#2a2e43',
        textAlign: 'center',
        borderWidth: 0.5,
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        color: '#2a2e43',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 7,
        width: width / 100 * 40,
    },
    CardCVV: {
        borderColor: '#2a2e43',
        borderWidth: 0.5,
        borderRadius: 10,
        textAlign: 'center',
        backgroundColor: '#e6e6e6',
        color: '#2a2e43',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 7,
        marginRight: 10,
        width: width / 100 * 25,
    },
    SubmitButton: {
        width: width / 2,
        paddingVertical: 15,
        borderRadius: 30,
        backgroundColor: '#2a2e43',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    SubmitButtonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cardno: {
        marginLeft: 5,
        marginRight: 5,
        color: "#fff",
        fontSize: 18
    },
    container: {
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    imageHolder: {
        position: 'relative',
        alignItems: 'center'
    },
    imageView: {
        width: width / 10 * 8,
        height: height / 4 + 50,
        borderRadius: 10,
    },
    cardHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: '50%'
    },
    nameHolder: {
        position: 'absolute',
        bottom: '10%',
        left: '15%'
    },
    nameValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold'
    },
    dateHolder: {
        position: 'absolute',
        bottom: '10%',
        right: '17%'
    },
    dateValue: {
        fontFamily:"Medium",
        color: "#fff",
        fontSize: 16
    }
})
export default CardView;