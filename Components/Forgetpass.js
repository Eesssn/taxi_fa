import React , { Component } from 'react'
import { View , TextInput , StyleSheet , Dimensions , Text , TouchableOpacity } from 'react-native';
var { width , height } = Dimensions.get('window');
import axios from 'axios';

const styles = StyleSheet.create({
    input: {
        fontFamily:"Medium",
        textAlign:'center',
        color: '#fff',
        borderBottomColor: '#fff',
        borderBottomWidth: 1.5,
        width: width / 6 * 4,
        marginBottom: 20,
        padding: 10,
        fontSize: 20
    },
    inputContainer: {
        flex: 2,
        alignItems:'center',
        justifyContent: 'flex-start',
    },
    Button:{
        backgroundColor:'#ffffff',
        padding:20,
        width:width /100 * 80,
        borderRadius:50,
        marginTop:30,
    },
    ButtonText:{
        fontFamily:"Medium",
        color:'#2a2e43',
        fontSize:16,
        textAlign:'center',
    }
})

class ForgetPass extends Component{
    constructor(props){
        super(props);
        this.state = {
            check:false,
            email:'',
        }
    }
    _Request = () => {
        var self = this;
        axios.post('reset_password',{
            email:this.state.email
        }).then(function(response){
            if(response.data.is_successful){
                self.setState({
                    check:true,
                })
            } else {
                alert(response.data.message)
            }
        }).catch(function(error){
        })
    }
    render(){
        return(
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder="E-Mail"
                    onSubmitEditing={() => this._Request()}
                    placeholderTextColor="#ffffff50"
                />
                <Text style={{color:"#ffffff50",fontFamily:"Medium",}}>
                    آدرس ایمیل خود را برای بازیابی رمز عبور خود وارد کنید
                </Text>
                <TouchableOpacity style={styles.Button} onPress={() => this._Request()}>
                    <Text style={styles.ButtonText}>
                        ارسال لینک
                    </Text>
                </TouchableOpacity>
                {this.state.check
                ?
                <View>
                    <Text>
                        ایمیل خود را بررسی کنید
                    </Text>
                </View>
                :
                null}
            </View>
        )
    }
}

export default ForgetPass;