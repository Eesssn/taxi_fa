import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import TopBar from './TopBar';
import Modal from 'react-native-modal';
import Axios from 'axios';
class Reserve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            date2: null,
            datep: new Date(),
            isDateTimePickerVisible: false,
            ReserveData: null,
            isModalVisible: false,
            Temp: null,
        }
    }
    componentDidMount() {
        let dateTime = new Date()
        this.setState({
            date: moment(dateTime).format('MM-DD-YYYY'),
            date2: dateTime,
        })
    }
    handleDatePicked = (date) => {
        this.setState({
            date: date.getDate().toString() + " - " + (date.getMonth() + 1).toString() + " - " + date.getFullYear().toString(),
            date2: date
        })
        var that = this;
        Axios.post('passenger/reserves', {
            passenger_id: this.props.PassengerId,
            token: this.props.Token,
            date: this.state.date2,
        }).then(function (response) {
            if (response.data.is_successful) {
                that.setState({
                    ReserveData: response.data.data,
                })
                that.hideDateTimePicker()
            } else {
                alert(response.data.message)
            }
        }).catch(function (err) {
        })
    }
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false })
    }
    FetchAllData = () => {
        var that = this;
        Axios.post('passenger/reserves', {
            passenger_id: this.props.PassengerId,
            token: this.props.Token,
        }).then(function (response) {
            if (response.data.is_successful) {
                that.setState({
                    ReserveData: response.data.data,
                })
                that.hideDateTimePicker()
            } else {
                alert(response.data.message)
            }
        }).catch(function (err) {
        })
    }
    cancelRes = (item) => {
        this.setState({
            isModalVisible: true,
            Temp: item
        })
    }
    cancelReserve = () => {
        var that = this;
        Axios.post('trip/cancel', {
            passenger_id: this.props.PassengerId,
            token: this.props.Token,
            trip_id: this.state.Temp.info.trip_id,
        }).then(function (response) {
            if (response.data.is_successful) {
                that.FetchAllData()
                that.setState({
                    isModalVisible: false
                })
            } else {
                alert(response.data.message)
                that.setState({
                    isModalVisible: false
                })
            }
        }).catch(function (e) {
        })
    }
    renderReserve = (data) => {
        let reserve = [];
        data.map(item => {
            reserve.push(
                <View key={item.id} style={styles.Card}>
                    {item.driver === null ? <View style={styles.SWB}>
                        <Image
                            source={require('../assets/profile.png')}
                            style={styles.DriverImg}
                        />
                        <Text>
                            No driver accepted yet
                        </Text>
                    </View> : <View style={styles.SWB}>
                            <Image
                                source={{ uri: item.driver.image_url }}
                                style={styles.DriverImg}
                            />
                            <Text>
                                {item.driver.full_name}
                            </Text>
                        </View>}
                    <View style={styles.SWB}>
                        <View style={styles.Row}>
                            <Image source={require('../assets/start.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ width: width / 100 * 30, lineHeight:20 }}>
                                {item.info.from_address}
                            </Text>
                        </View>
                        <View style={styles.Row}>
                            <Image source={require('../assets/target.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ width: width / 100 * 30, lineHeight:20 }}>
                                {item.info.to_address}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.SWOB}>
                        <View style={styles.Row}>
                            <View style={styles.Label}>
                                <Text>
                                    {item.reserve_date}
                                </Text>
                            </View>
                            <View style={styles.Label}>
                                <Text>
                                    {item.reserve_time}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.SWOB}>
                        <View style={styles.Row}>
                            <TouchableOpacity onPress={() => this.cancelRes(item)} style={{ backgroundColor: "#db3535", paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ color: "white", textAlign: 'center' }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        })
        return reserve;
    }
    render() {
        return (
            <View style={{ height: height }}>
                <TopBar title="رزرو" leftIcon="back" ShowMenu={this.props.ShowMenu} />
                <TouchableOpacity style={styles.DatePickerBtn} onPress={() => this.setState({ isDateTimePickerVisible: true })} >
                    <Text style={[styles.DatePickerBtnText,{fontFamily:"Medium",}]}>
                        {this.state.date}
                    </Text>
                </TouchableOpacity>
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ width: (width - 20), height: height / 4, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ marginBottom: 30 , fontFamily:"Medium", }}>
                            مطمئنی ?
                        </Text>
                        <View style={{flexDirection:'row' ,alignItems:'center' , justifyContent:'space-around'}}>
                            <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => this.cancelReserve()}>
                                <Text style={{fontFamily:"Medium",}}>
                                    بله
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => this.setState({ isModalVisible: false })}>
                                <Text style={{fontFamily:"Medium",}}>
                                    خیر
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    is24Hour={false}
                    mode="date"
                    date={this.state.date2}
                    minimumDate={this.state.datep}
                />
                <View style={{ marginVertical: 10 }}>
                    <TouchableOpacity onPress={() => this.FetchAllData()} style={{ backgroundColor: "#2a2e43", paddingHorizontal: 30, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: "white", textAlign: 'center' ,fontFamily:"Medium", }}>
                            مشاهده همه
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.Container}>
                        {this.state.ReserveData !== null ? this.renderReserve(this.state.ReserveData) : this.renderReserve(this.props.Data)}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        paddingBottom: 20,
    },
    Card: {
        width: width / 100 * 46,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        borderColor: '#707070',
        borderWidth: 0.5,
        paddingTop: 10,
        paddingBottom: 10,
        margin: width / 100 * 2,
        marginBottom: 20,
    },
    SWB: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#70707050',
        borderBottomWidth: 0.5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    SWOB: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    Row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10,
        width: width / 100 * 46
    },
    DriverImg: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    Label: {
        backgroundColor: '#ffffff',
        paddingBottom: 3,
        paddingTop: 3,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 15,
        borderColor: '#707070',
        borderWidth: 0.5,
        marginRight: 5,
        marginLeft: 5
    },
    DatePickerBtn: {
        width: width / 100 * 90,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 12,
        marginTop: 12,
        marginLeft: width / 100 * 5
    },
    DatePickerBtnText: {
        textAlign: 'center',
        fontFamily:"Medium",
    }
})
export default Reserve;