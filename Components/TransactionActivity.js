import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    StyleSheet,
    TextInput,
    FlatList,
} from 'react-native';
import Axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import TopBar from './TopBar';
import CardView from './CardView';
import PayItem from './PayItem';
import Modal from 'react-native-modal';
import CardAPI from './CardAPI';
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Page: 'main',
            isModalVisible:false,
            isDateTimePickerVisible: false,
            date: null,
            date2: null,
            dateP: new Date(),
            Issue: null,
            Cards: [],
            CardDetail:null,
            isModalVisible2:false,
            Temp: null,
        }
    }
    componentDidMount() {
        this.fetchCards()
        let dateTime = new Date()
        this.setState({
            date: moment(dateTime).format('MM DD YYYY'),
            date2: dateTime,
        })
    }
    fetchCards = () => {
        var that = this;
        Axios.post('passenger/cards', {
            passenger_id: that.props.PassengerId,
            token: that.props.Token,
        }).then(function (response) {
            if (response.data.is_successful) {
                that.setState({
                    Cards: response.data.data
                })
            } else {
                alert(response.data.message)
            }
        }).catch(function (e) {
        })
    }
    handleDatePicked = (date) => {
        this.setState({
            date: date.getDate().toString() + " " + (date.getMonth() + 1).toString() + " " + date.getFullYear().toString(),
            date2: date
        })
        var that = this
        Axios.post('passenger/card/transactions',{
            passenger_id:that.props.PassengerId,
            token:that.props.Token,
            id:that.state.Temp.item.id,
            date:date
        }).then(function(response){
            if(response.data.is_successful){
                that.setState({
                    CardDetail:response.data.data
                })
                that.hideDateTimePicker()
            } else {
                alert(response.data.message)
            }
        }).catch(function(e){
        })
    }
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false })
    }
    _Report() {
        alert('Your Issue Submitted !')
        this.setState({
            Page: 'main'
        })
    }
    Seter = (item) => {
        this.setState({
            Temp: item,
            Page:"Card"
        })
        setTimeout(() => {
            this.FetchCardDetail()
        }, 100);
    }
    deleteCard = (item) => {
        this.setState({
            Temp:item,
            isModalVisible:true
        })
    }
    defaultCard = (item) => {
        this.setState({
            Temp:item,
            isModalVisible2:true
        })
    }
    _DeleteCard = () => {
        var that = this
        Axios.post('passenger/card/delete',{
            passenger_id:that.props.PassengerId,
            token:that.props.Token,
            id:that.state.Temp.item.id
        }).then(function(response){
            if(response.data.is_successful){
                alert('successful');
                that.fetchCards()
                that.setState({
                    isModalVisible:false,
                })
            } else {
                alert(response.data.message)
            }
        }).catch(function(e){
        })
    }
    _DefaultCard = () => {
        var that = this
        Axios.post('passenger/card/default',{
            passenger_id:that.props.PassengerId,
            token:that.props.Token,
            id:that.state.Temp.item.id
        }).then(function(response){
            if(response.data.is_successful){
                alert('successful');
                that.fetchCards()
                that.setState({
                    isModalVisible2:false,
                })
            } else {
                alert(response.data.message)
            }
        }).catch(function(e){
        })
    }
    FetchCardDetail = () => {
        var that = this
        Axios.post('passenger/card/transactions',{
            passenger_id:that.props.PassengerId,
            token:that.props.Token,
            id:that.state.Temp.item.id
        }).then(function(response){
            if(response.data.is_successful){
                that.setState({
                    CardDetail:response.data.data
                })
            } else {
                alert(response.data.message)
            }
        }).catch(function(e){
        })
    }
    render() {
        switch (this.state.Page) {
            case 'Card':
                return (
                    <View>
                        <TopBar title="جزئیات کارت" leftIcon="back" ShowMenu={() => this.setState({ Page: 'main' })} />
                        <View style={{ marginTop: 15, alignItems: 'center' }}>
                            <View>
                                <TouchableOpacity style={styles.DatePickerBtn} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                                    <Text style={{fontFamily:"Medium",}}>
                                        انتخاب تاریخ
                                        </Text>
                                    <Text style={{fontFamily:"Medium",}}>
                                        {this.state.date}
                                    </Text>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible}
                                    onConfirm={this.handleDatePicked}
                                    onCancel={this.hideDateTimePicker}
                                    is24Hour={false}
                                    mode="date"
                                    date={this.state.date2}
                                />
                            </View>
                            <View style={{marginVertical:20}}>
                                <TouchableOpacity onPress={() => this.FetchCardDetail()} style={{paddingHorizontal:20,paddingVertical:10,borderRadius:10,backgroundColor:'#2a2e43',alignSelf:'center'}}>
                                    <Text style={{color:"white",textAlign:'center' , fontFamily:"Medium",}}>
                                        مشاهده تمام تراکنش ها
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{fontFamily:"Medium",}}>
                                    تراکنش های اخیر
                                </Text>
                            </View>
                            <PayItem data={this.state.CardDetail}/>
                        </View>
                    </View>
                )
                break;
            case 'AddCard':
                return (
                    <View>
                        <TopBar title="افزودن کارت جدید" leftIcon="back" ShowMenu={() => this.setState({ Page: 'main' })} />
                        <CardAPI
                            Token={this.props.Token}
                            PassengerId={this.props.PassengerId}
                            PageSwitcher={() => this.setState({ Page: "main" })}
                        />
                    </View>
                )
                break;
            default:
                return (
                    <View style={{ flex: 1, marginBottom:20 , alignItems: 'center', justifyContent: 'flex-start' }}>
                        <TopBar title="پرداخت ها" leftIcon="back" ShowMenu={this.props.ShowMenu} />
                        <TouchableOpacity style={styles.AddNewCardBtn} onPress={() => this.setState({ Page: 'AddCard' })}>
                            <Text style={[styles.AddNewCardBtnTxt,{fontFamily:"Medium"}]}>
                                افزودن کارت جدید
                                </Text>
                        </TouchableOpacity>
                        <View style={styles.ChooseCard}>
                            <Text style={{fontFamily:"Medium",}}>
                                کارت را انتخاب کنید تا جزئیات را ببینید
                                </Text>
                        </View>
                        <Modal isVisible={this.state.isModalVisible}>
                            <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 16, marginBottom: 15 , fontFamily:"Medium", }}>
                                    مطمئنی ؟
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this._DeleteCard()} style={{ backgroundColor: '#2a2e43', paddingVertical: 10, borderRadius: 10, width: width / 10 * 4, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: "#fff", fontFamily:"Medium", fontSize: 15, textAlign: 'center' }}>
                                            بله
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({isModalVisible:false})} style={{ width: width / 10 * 4, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 15, fontFamily:"Medium", textAlign: 'center' }}>
                                            خیر
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        <Modal isVisible={this.state.isModalVisible2}>
                            <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 16, marginBottom: 15 , fontFamily:"Medium", }}>
                                    مطمئنی?
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this._DefaultCard()} style={{ backgroundColor: '#2a2e43', paddingVertical: 10, borderRadius: 10, width: width / 10 * 4, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: "#fff",fontFamily:"Medium", fontSize: 15, textAlign: 'center' }}>
                                            بله
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({isModalVisible2:false})} style={{ width: width / 10 * 4, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 15, fontFamily:"Medium", textAlign: 'center' }}>
                                            خیر
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        <FlatList
                            data={this.state.Cards}
                            renderItem={(item) => <CardView
                                onDelete={() => this.deleteCard(item)}
                                setAsDefault={() => this.defaultCard(item)}
                                click={() => this.Seter(item)}
                                delete={() => this.deleteCard(item)}
                                data={item} />
                            }
                            keyExtractor={item => item.id}
                        />
                    </View>
                )
                break;
        }
    }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    AddNewCardBtn: {
        padding: 20,
        width: width / 100 * 80,
        marginHorizontal: width / 100 * 10,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#707070',
        marginVertical: 10,
    },
    AddNewCardBtnTxt: {
        textAlign: 'center',
    },
    ChooseCard: {
        marginVertical: 15
    },
    DatePickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        width: width / 100 * 80,
        marginHorizontal: width / 10,
        borderColor: '#707070',
        borderWidth: 0.2,
        borderRadius: 10,
    },
    TextInputStyle: {
        width: width / 100 * 90,
        padding: 10,
        borderColor: '#707070',
        backgroundColor: '#d7d7d7',
        color: '#000',
        marginTop: 12,
        marginBottom: 20,
        borderRadius: 10,
    },
    ReportContainer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    ReportBtn: {
        backgroundColor: '#2a2e43',
        width: width / 100 * 80,
        borderRadius: 30,
        marginHorizontal: width / 10,
        padding: 15,
    },
    ReportBtnTxt: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center'
    }
})
export default Payment;