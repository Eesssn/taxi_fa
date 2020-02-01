import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet , Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

class SettingsView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notification: 'فعال',
            buttonstyle: styles.buttonOn,
            textstyle: styles.textOn,
            labelText: styles.labelOn,
        }
    }


    changeNotification() {
        if (this.state.notification === "فعال") {
            this.setState({
                notification: 'غیر فعال',
                buttonstyle: styles.button,
                textstyle: styles.text,
                labelText: styles.label,
            })
        } else {
            this.setState({
                notification: "فعال",
                buttonstyle: styles.buttonOn,
                textstyle: styles.textOn,
                labelText: styles.labelOn,
            })
        }
    }





    render() {
        return (
            <View style={styles.Container}>
                <TouchableOpacity style={styles.button} onPress={this.props.GoToGeneral}>
                    <View>
                        <Text style={{fontFamily:"Medium",}}>عمومی</Text>
                    </View>
                    <View>
                        <Image source={require('../assets/right-arrow.png')} style={styles.arrow} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.buttonstyle} onPress={() => this.changeNotification()}>
                    <View>
                        <Text style={[this.state.labelText,{fontFamily:"Medium",}]}>اعلانات</Text>
                    </View>
                    <View>
                        <Text style={[this.state.textstyle,{fontFamily:"Medium",}]}>{this.state.notification}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.props.GoToFavorite}>
                    <View>
                        <Text style={{fontFamily:"Medium",}}>مسیر های منتخب</Text>
                    </View>
                    <View>
                        <Image source={require('../assets/right-arrow.png')} style={styles.arrow} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20
    },
    button: {
        flexDirection: 'row-reverse',
        padding: 20,
        backgroundColor: '#F2F2F2',
        borderColor: '#BDBDBD',
        borderWidth: 1,
        width: width / 100 * 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        marginBottom: 15
    },
    buttonOn: {
        flexDirection: 'row-reverse',
        padding: 20,
        backgroundColor: '#2A2E43',
        width: width / 100 * 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        marginBottom: 15
    },
    label: {
        color: 'black',
    },
    labelOn: {
        color: 'white',
    },
    text: {
        color: '#AFAFAF',
        fontFamily:"Medium",
    },
    textOn: {
        color: '#fff',
        fontFamily:"Medium",
    },
    arrow: {
        transform:[{rotate: '180deg'}],
        width: 15,
        height: 15
    },
    notificationOn: {
        backgroundColor: '#2A2E43'
    },
    notificationOff: {
        backgroundColor: '#F2F2F2'
    }
})

export default SettingsView;
