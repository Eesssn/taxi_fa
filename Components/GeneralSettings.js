import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import ChangeName from './ChangeName';
import ChangePhone from './ChangePhone';
import ChangePassword from './ChangePassword';
import TopBar from './TopBar';
import axios from 'axios';
import PhoneVerify from './PhoneVerify';


const { width } = Dimensions.get('window');

class General extends Component {
    constructor(props) {
        super(props);
        this.state = {
            main: true,
            changeName: false,
            changePhone: false,
            changePassword: false,
            Fullname: null,
            Token: null,
            Code:null,
            Pass: null,
            oPass: null,
            RPass: null,
            Phone: null,
            PassengerId: null,
            VerifyPhone:false,
        }
    }
    GetValues = () => {
        var thiss = this;
        axios.post('passenger', {
            token: this.state.Token,
            passenger_id: this.state.PassengerId,
        }).then(function (response) {
            if (response.data.is_successful) {
                thiss.setState({
                    Fullname: response.data.data.full_name
                })
            } else {
                alert(response.data.message)
            }
        }).catch(function (error) {
        })
    }
    componentDidMount() {
        this.setState({
            Fullname: this.props.Name,
            Token: this.props.Token,
            Phone: this.props.Phone,
            PassengerId: this.props.PassengerId
        })
    }
    _changeName() {
        this.setState({
            main: false,
            changeName: true,
        })
    }

    _changePhone() {
        this.setState({
            main: false,
            changePhone: true,
        })
    }
    _changePass() {
        this.setState({
            main: false,
            changePassword: true,
        })
    }
    _saveName = () => {
        var thiss = this;
        axios.put('passenger/update', {
            full_name: this.state.Fullname,
            token: this.state.Token,
            passenger_id: this.state.PassengerId,
        }).then(function (response) {
            if (response.data.is_successful) {

                thiss.GetValues()
                thiss.setState({
                    main: true,
                })
                thiss.props.Logout2()
                thiss.props.getValuesFromAsync()
            } else {
                alert(response.data.message)
            }
        }).catch(function (error) {
        })
    }
    _savePhone = () => {
        var that = this;
        axios.put('passenger/update', {
            phone_number: this.state.Phone,
            token: this.state.Token,
            passenger_id: this.state.PassengerId,
        }).then(function (response) {
            if (response.data.is_successful) {
                that._VerifyPhone()
                that.props.Logout2()
                thiss.props.getValuesFromAsync()
            } else {
                alert(response.data.message)
            }
        }).catch(function (err) {
        })
    }

    _VerifyPhone = () => {
        this.setState({
            VerifyPhone:true
        })
    }

    SubmitVerifyCode = () => {
        var self = this;
        if (this.state.Code) {
            axios.post('/verify', {
                phone_number: this.state.Phone,
                code: this.state.Code,
            }).then(function (response) {
                if (response.data.is_successful === false) {
                    alert(response.data.message)
                }
                if (response.data.is_successful === true) {
                    self._save()
                }
            }).catch(function (error) {
            });
        } else {
            alert('Fill input')
        }
    }
    _savePass = () => {
        if (this.state.Pass === this.state.RPass) {
            var that = this;
            axios.put('passenger/update', {
                password: that.state.Pass,
                token: that.state.Token,
                passenger_id: that.state.PassengerId,
            }).then(function (response) {
                if (response.data.is_successful) {
                    that._save()
                    that.props.Logout2()
                    thiss.props.getValuesFromAsync()
                } else {
                    alert(response.data.message)
                }
            }).catch(function (err) {
            })
        } else {
            alert('password not equal')
        }
    }
    _save() {
        this.setState({
            main: true,
            changePhone: false,
            changeName: false,
            changePassword: false,
        })
    }

    render() {
        if (this.state.main) {
            return (
                <View style={{ flex: 1 }}>
                    <TopBar ShowMenu={this.props.ShowMenu} title="تنظیمات عمومی" leftIcon="back" />
                    <View style={styles.Container}>
                        <TouchableOpacity style={styles.button} onPress={() => this._changeName()}>
                            <View>
                                <Text style={{fontFamily:"Medium"}}>تغییر نام</Text>
                            </View>
                            <View>
                                <Text style={[styles.text,{fontFamily:"Medium",}]}>{this.props.fullData.full_name}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this._changePhone()}>
                            <View>
                                <Text style={{fontFamily:"Medium"}}>تغییر شماره تماس</Text>
                            </View>
                            <View>
                                <Text style={[styles.text,{fontFamily:"Medium"}]}>{this.props.fullData.phone_number}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this._changePass()}>
                            <View>
                                <Text style={{fontFamily:"Medium"}}>تغییر رمزعبور</Text>
                            </View>
                            <View>
                                <Text style={styles.text}>************</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        if(this.state.VerifyPhone){
            return <PhoneVerify
                        VerifyPhone={() => this.SubmitVerifyCode()}
                        PhoneVerifyVal={this.state.Code}
                        PhoneVerifyCh={(phone) => this.setState({Code:phone})}
                        // VerifyPhone={() => this.VerifyPhone()}
                    />
        }
        if (this.state.changeName) {
            return (
                <ChangeName
                    Name={this.state.Fullname}
                    saveName={() => this._saveName()}
                    ChangeName={(name) => this.setState({ Fullname: name })}
                    ShowMenu={() => this._save()}
                />
            )
        }
        if (this.state.changePhone) {
            return (
                <ChangePhone
                    Phone={this.state.Phone}
                    savePhone={() => this._savePhone()}
                    ChangePhone={(phone) => this.setState({ Phone: phone })}
                    ShowMenu={() => this._save()}
                />
            )
        }
        if (this.state.changePassword) {
            return (
                <ChangePassword
                    Pass={this.state.Pass}
                    oPass={this.state.oPass}
                    RPass={this.state.RPass}
                    ChangeOPass={(val) => this.setState({ oPass: val })}
                    ChangePass={(val) => this.setState({ Pass: val })}
                    ChangePass2={(val) => this.setState({ RPass: val })}
                    savePass={() => this._savePass()}
                    ShowMenu={() => this._save()}
                />
            )
        }
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ProfileImage: {
        width: width / 3,
        height: width / 3,
        marginBottom: 20,
        borderRadius: width / 20,
        borderWidth: 1,
        borderColor: '#707070',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    button: {
        flexDirection: 'row',
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
    text: {
        fontFamily:"Medium",
        color: '#AFAFAF',
    }
})

export default General;