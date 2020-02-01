import React , { Component } from 'react';
import { View , Text , TouchableOpacity , ActivityIndicator , StyleSheet , Dimensions , TextInput } from 'react-native';
import Axios from 'axios';

class PhoneVerify extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            resendTimer:10,
        }
    }
    componentDidMount(){
        this.decremental()
    }
    decremental = () => {
        let interval = setInterval(() => {
            this.setState({resendTimer:this.state.resendTimer - 1})
            if(this.state.resendTimer === 0){
                clearInterval(interval)
            }
        }, 1000);
    }
    ResendCode = () => {
        this.setState({
            loading:true
        })
        var that = this;
        Axios.post('resend_code',{
            phone_number:that.props.Phone,
        }).then(function(response){
            if(response.data.is_successful){
                that.setState({
                    loading:false,
                    resendTimer:10
                })
                that.decremental()
            } else {
                alert(response.data.message)
                that.setState({
                    loading:false
                })
            }
        }).catch(function(e){
            that.setState({
                loading:false
            })
        })
    }
    render(){
        return(
            <View style={styles.Container}>
                <View>
                    <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        autoCorrect={false}
                        placeholder="کد تایید شماره تماس"
                        placeholderTextColor="#ffffff50"
                        autoFocus={true}
                        value={this.props.PhoneVerifyVal}
                        onChangeText={this.props.PhoneVerifyCh}
                        onSubmitEditing={this.props.VerifyPhone}
                    />
                    {this.state.loading ? <ActivityIndicator size="large" color="white"/> : <TouchableOpacity disabled={this.state.resendTimer > 0 ? true : false} style={{margin:10}} onPress={() => this.ResendCode()}>
                      <Text style={{textAlign:'center',color:"#ffffff",fontSize:16,fontFamily:"Medium"}}>
                        {this.state.resendTimer > 0 ? `00:${this.state.resendTimer < 10 ? "0"+this.state.resendTimer : this.state.resendTimer}` : "کد ارسال نشد؟ دوباره تلاش کنید."}
                      </Text>
                    </TouchableOpacity>}
                    <TouchableOpacity onPress={this.props.VerifyPhone} style={styles.Button}>
                        <Text style={styles.ButtonText}>
                            ثبت
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
    Container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        backgroundColor:'#2a2e43',
    },
    input:{
        fontFamily:"Medium",
        borderBottomColor:'#ffffff',
        borderBottomWidth:1,
        color:'#fff',
        padding:15,
        width: width / 100 * 80,
        marginBottom:30,
        textAlign:'center',
        fontSize:18
    },
    Button:{
        backgroundColor:'#ffffff',
        padding:15,
        width: width / 100 * 80,
        borderRadius:40,
    },
    ButtonText:{
        color:'#2a2e43',
        fontFamily:"Medium",
        fontSize:15,
        fontWeight:'800',
        textAlign:'center',
    }
})
export default PhoneVerify;