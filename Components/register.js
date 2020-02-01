import React, { Component } from 'react';
import FirstStep from './RegisterFirstStep';
import LastStep from './RegisterLastStep';
import PhoneVerify from './PhoneVerify';
import axios from 'axios';
import { Platform, View, } from 'react-native';
import SwitchMenuHeader from './SwitchMenuHeader';
import Toast from 'react-native-easy-toast'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Page: "first",
            TokenAndPID: null,
            Fullname: null,
            PolicyChecker:false,
            PhoneVerifyVal: '',
            Phone: null,
            CanGo:false,
            ReferrerCode:null,
            Password: null,
            Repass: null,
            active: false,
            Sex: "1",
            InviteCode: null,
        }
    }
    Changer() {
        this.setState({ Page: "second" })
    }
    CheckForRequest() {
        this.setState({
            CanGo:true
        });
        var self = this;
        let body = new FormData();
        body.append('full_name', this.state.Fullname);
        body.append("phone_number", this.state.Phone);
        if(this.state.ReferrerCode !== null) body.append('invite_code',this.state.ReferrerCode);
        body.append("is_male", this.state.Sex === null ? parseFloat(this.state.Sex) : this.state.Sex);
        body.append("password", this.state.Password);
        if (
            this.state.Fullname &&
            this.state.Phone &&
            this.state.Password &&
            this.state.Repass &&
            this.state.PolicyChecker
        ) {
            if (this.state.Password === this.state.Repass) {
                axios.post('/register',
                    body
                    , {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(function (response) {
                        if (response.data.is_successful === false) {
                            alert(response.data.message);
                            self.setState({
                                CanGo:false
                            })
                        }
                        if (response.data.is_successful === true) {
                            self.setState({ Page: "second" });
                            self.setState({
                                CanGo:false
                            })
                        }
                    }).catch(function (error) {
                        alert((error));
                    self.setState({
                        CanGo:false
                    })
                    });
            } else {
                self.setState({
                    CanGo:false
                });
                self.refs.toast.show('Passwords are not equal');
            }
        } else {
            self.setState({
                CanGo:false
            });
            self.refs.toast.show('Fill all input');
        }
    }
    CheckPhoneVerify() {
        var self = this;
        if (this.state.PhoneVerifyVal) {
            axios.post('/verify', {
                phone_number: self.state.Phone,
                code: self.state.PhoneVerifyVal,
            }).then(function (response) {
                if (response.data.is_successful === false) {
                    alert(response.data.message)
                }
                if (response.data.is_successful === true) {
                    self.props.PageSwitcher()
                    alert("با موفقیت ثبت نام شدید. لطفا وارد شوید")
                }
            }).catch(function (error) {
                console.warn(error)
            });
        } else {
            alert('Fill input')
        }
    }
    PolicyChecker = () => {
        if(this.state.PolicyChecker){
            this.setState({
                PolicyChecker:false
            })
        } else {
            this.setState({
                PolicyChecker:true
            })
        }
    };
    render() {
        switch (this.state.Page) {
            case "first":
                return (
                    <View style={{ flex: 1 }}>
                        <SwitchMenuHeader
                            navigate="ورود"
                            renderResults={this.props.renderResults}
                        />
                        <FirstStep
                            CanGo={this.state.CanGo}
                            policycolor={this.state.PolicyChecker === true ? "white" : "transparent"}
                            policy={() => this.PolicyChecker()}
                            ReferrerCode={this.state.ReferrerCode}
                            ReferrerCodeCH={(reffer) => this.setState({ReferrerCode:reffer}) }
                            InviteCode={this.state.InviteCode}
                            InviteCodeCh={(invite) => this.setState({ InviteCode: invite })}
                            FullnameCh={(name) => this.setState({ Fullname: name })}
                            Fullname={this.state.Fullname}
                            phoneCh={(phone) => this.setState({Phone:phone})}
                            Phone={this.state.Phone}
                            EmailCh={(mail) => this.setState({ Email: mail })}
                            Email={this.state.Email}
                            PasswordCh={(pass) => this.setState({ Password: pass })}
                            Password={this.state.Password}
                            RepassCh={(repass) => this.setState({ Repass: repass })}
                            Repass={this.state.Repass}
                            SexCh={(itemValue) => this.setState({ Sex: itemValue })}
                            Sex={this.state.Sex}
                            CheckRequest={() => this.CheckForRequest()}
                        />
                        <Toast ref="toast"/>
                    </View>
                );
            case "second":
                return <PhoneVerify
                    Phone={this.state.Phone}
                    PhoneVerifyVal={this.state.PhoneVerifyVal}
                    PhoneVerifyCh={(code) => this.setState({ PhoneVerifyVal: code })}
                    VerifyPhone={() => this.CheckPhoneVerify()}
                />;
            case "third":
                return <LastStep
                    Token={this.state.TokenAndPID.token}
                    PassengerId={this.state.TokenAndPID.passenger_id}
                    name={this.state.Fullname}
                    PageSwitcher={() => this.props.PageSwitcher()}
                />;
            default:
                return <CardVerify />;
        }
    }
}

export default Register;