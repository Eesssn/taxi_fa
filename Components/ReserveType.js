import React , { Component } from 'react';
import { View , Dimensions , Text , TextInput , StyleSheet , TouchableOpacity } from 'react-native';
const {width,height} = Dimensions.get('window');

class Reservation extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render(){
        return(
            <View style={styles.Container}>
                <TouchableOpacity style={styles.ReserveButton} onPress={this.props.Reserved}>
                    <Text style={[styles.ReserveText,{fontFamily:"Medium",}]}>
                        رزرو
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NowButton} onPress={this.props.Booknow}>
                    <Text style={[styles.NowText,{fontFamily:"Medium",}]}>
                        همین الان
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        marginTop:10,
        marginBottom:10,
        padding:12,
        borderBottomColor:'#d7d7d7',
        borderBottomWidth:1,
    },
    headerTitle:{
        textAlign:'center',
        fontSize:14,
        fontFamily:"Medium",
    },
    Container:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingBottom:50
    },
    ContainerFull:{
        height:height,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    NowButton:{
        width:width / 100 * 80,
        paddingTop:15,
        paddingBottom:15,
        borderRadius:10,
        backgroundColor:'#2A2E43',
        marginTop:7,
        marginBottom:7,
    },
    NowText:{
        textAlign:'center',
        fontSize:16,
        fontFamily:"Medium",
        color:'#fff'
    },
    ReserveButton:{
        borderWidth:1,
        borderColor:"#707070",
        width:width / 100 * 80,
        paddingTop:15,
        paddingBottom:15,
        borderRadius:10,
        backgroundColor:'#fff',
        marginTop:7,
        marginBottom:7,
    },
    ReserveText:{
        textAlign:'center',
        fontSize:16,
        fontFamily:"Medium",
        color:'#2A2E43'
    },
})

export default Reservation;