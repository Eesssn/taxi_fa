import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';

class PromoCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Promo: '',
        }
    }
    componentDidMount(){
        if(this.props.voucherStatus){
            this.setState({
                Promo:"main"
            })
        }
    }
    render() {
        switch (this.props.promoStatus) {
            case "success":
                return (
                    <View style={styles.messageContainer}>
                        <View style={styles.success}>
                            <Text style={[styles.successText,{fontFamily:"Medium",}]}>
                                ثبت شد!
                                </Text>
                        </View>
                    </View>
                )
                break;
            case "error":
                return (
                    <View style={styles.messageContainer}>
                        <View style={styles.error}>
                            <Text style={[styles.errorText,{fontFamily:"Medium",}]}>
                                کد اشتباه است!
                                </Text>
                        </View>
                    </View>
                )
                break;

            default:
                return (
                    <KeyboardAvoidingView behavior="padding" enabled={true}>
                        <View>
                            <View style={styles.header}>
                                <Text style={[styles.headerText,{fontFamily:"Medium",}]}>
                                    کد تخفیف خود را وارد کنید
                                </Text>
                            </View>
                            <View style={styles.container}>
                                <TextInput
                                    style={styles.input}
                                    value={this.props.sumbitValue}
                                    onChangeText={this.props.sumbitValueCH}
                                    keyboardAppearance="light"
                                    placeholder="کد تخفیف"
                                    autoFocus={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    blurOnSubmit={false}
                                />
                                <TouchableOpacity style={styles.submitButton} onPress={this.props.submit}>
                                    <Image source={require('../assets/enter.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                )
                break;
        }
    }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    basement: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: width,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    headerText: {
        padding: 10,
        fontSize: 14,
        fontFamily:"Medium",
    },
    container: {
        flexDirection: 'row',
        position: 'relative',
        height: height / 100 * 20,
    },
    input: {
        fontFamily:"Medium",
        position: 'absolute',
        left: width / 100 * 10,
        top: 0,
        width: width / 100 * 80,
        padding: 10,
        borderWidth: 1,
        borderColor: '#707070',
        backgroundColor: '#d7d7d7',
        borderRadius: 10,
    },
    submitButton: {
        fontFamily:"Medium",
        position: 'absolute',
        right: width / 100 * 11,
        top: 1,
        backgroundColor: '#FFFFFF',
        borderColor: '#707070',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    messageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    success: {
        backgroundColor: '#D1EDD1',
        borderRadius: 10,
        padding: 10,
        width: width / 100 * 80,
        margin: 20,
    },
    error: {
        backgroundColor: '#F2D0D0',
        borderRadius: 10,
        padding: 10,
        width: width / 100 * 80,
        margin: 20,
    },
    successText: {
        color: '#1ED51E',
        fontSize: 16,
        fontFamily:"Medium",
        textAlign: 'center'
    },
    errorText: {
        color: "#D51E1E",
        fontSize: 16,
        fontFamily:"Medium",
        textAlign: 'center'
    },
})
export default PromoCode;