import React , { Component } from 'react';
import {
    View,
    Dimensions,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
const {width,height} = Dimensions.get('window');

class TakeNote extends Component {
    constructor(props){
        super(props);
        this.state = {
            Note:'',
            style:"styles.Container"
        }
    }

    render(){
        return(
            <KeyboardAvoidingView enabled={true} behavior={'padding'}>
                <View style={styles.ContainerFull}>
                    <TextInput
                        multiline = {true}
                        numberOfLines = {5}
                        onChangeText={this.props.SetNote}
                        value={this.props.NoteVal}
                        placeholderTextColor="#707070"
                        placeholder="یادداشت خود را بنویسید. اختیاری است"
                        style={styles.TextInputStyle}
                    />
                    <TouchableOpacity style={styles.button} onPress={this.props.FinishNote}>
                        <Text style={[styles.text,{fontFamily:"Medium",}]}>
                            بعدی
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    TextInputStyle:{
        fontFamily:"Medium",
        width:width/100*90,
        padding:10,
        borderColor:'#707070',
        backgroundColor:'#dedede',
        color:'#000',
        marginTop:12,
        marginBottom:20,
        borderRadius:10,
    },
    Container:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    ContainerFull:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingBottom:50,
    },
    button:{
        width:width / 100 * 80,
        paddingTop:15,
        paddingBottom:15,
        borderRadius:10,
        backgroundColor:'#2A2E43',
        marginTop:7,
        marginBottom:7,
    },
    text:{
        textAlign:'center',
        fontSize:16,
        fontFamily:"Medium",
        color:'#fff'
    },
})

export default TakeNote;