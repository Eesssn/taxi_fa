import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';
const {width} = Dimensions.get('window');
class LeftMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <View style={{marginTop:20}}>
                <View style={styles.viewFirst}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ color: "#ffffff", fontFamily:"Medium", fontSize: 18 }}>
                            {this.props.fullData.full_name} نام و نام خانوادگی
                        </Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={{ color: "#B1B1B1", fontFamily:"Medium", fontSize: 16 }}>
                            {this.props.fullData.phone_number}
                        </Text>
                        <Text style={{ color: "#B1B1B1", fontFamily:"Medium", fontSize: 16 }}>
                            شماره تماس{" "}
                        </Text>
                    </View>
                    <View>
                        <Text style={{ color: "#B1B1B1", fontFamily:"Medium", fontSize: 16 }}>
                            کد معرف: {this.props.ReferrerCode}
                        </Text>
                    </View>
                </View>
                <View style={styles.secondContainer}>
                    <TouchableOpacity style={styles.touchable} onPress={this.props.HideMenu}>
                        <Image source={require('../assets/Home.png')} style={styles.image}  />
                        <Text style={styles.text}>
                            صفحه اصلی
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable} onPress={this.props.History}>
                        <Image source={require('../assets/History.png')} style={styles.image}  />
                        <Text style={styles.text}>
                            تاریخچه سفر
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable} onPress={this.props.Reserve}>
                        <Image source={require('../assets/reserve.png')} style={styles.image}  />
                        <Text style={styles.text}>
                            رزرو
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.SettingToggle} style={styles.touchable}>
                        <Image source={require('../assets/Setting.png')} style={styles.image}  />
                        <Text style={styles.text}>
                            تنظیمات
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.Support} style={styles.touchable}>
                        <Image source={require('../assets/support.png')} style={styles.image}  />
                        <Text style={styles.text}>
                            پشتیبانی
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.About} style={styles.touchable}>
                        <Image source={require('../assets/scroll.png')} style={styles.image}  />
                        <Text style={styles.text}>
                            درباره ما
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable} onPress={this.props.logout}>
                        <Image source={require('../assets/Logout.png')} style={styles.image} />
                        <Text style={styles.text}>
                            خروج
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    first: {
        position: 'absolute',
        top: 20,
        left: 20
    },
    headerImage: {
        width: 32,
        height: 32
    },
    viewFirst: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageFirst: {
        width: width / 3,
        height: width / 3,
        borderRadius: 40,
        borderColor: "#78849E",
        borderWidth: 2
    },
    secondContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: width,
        paddingRight: (width / 10) * 2,
        paddingTop: width / 10
    },
    touchable: {
        paddingVertical:6,
        alignItems: 'center',
        width:width - ((width / 10) * 2),
        justifyContent: 'flex-start',
        flexDirection: 'row-reverse',
        marginBottom: 12
    },
    text:{
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily:"Medium",
    },
    image:{
        width: 26,
        height: 26,
        marginLeft: 25
    }
})

export default LeftMenuView;