import React , { Component } from 'react';
import { View , Text , TouchableOpacity , StyleSheet } from 'react-native';

class TaxiArrived extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.headerText,{fontFamily:"Medium",}]}>
                        تاکسی شما رسید
                    </Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={this.props.cancel}>
                        <Text style={[styles.primaryButtonText,{fontFamily:"Medium",}]}>
                            لغو {`C$` + this.props.cancelCharge}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        paddingBottom:50,
    },
    header:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        marginBottom:15,
    },
    headerText:{
        textAlign:'center',
        fontSize:16,
        fontFamily:"Medium",
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:15,
    },
    primaryButton:{
        backgroundColor:'#2A2E43',
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:30,
        paddingRight:30,
        marginRight:5,
        borderRadius:10,
    },
    whiteButton:{
        backgroundColor:'#FFFFFF',
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:30,
        paddingRight:30,
        marginLeft:5,
        borderRadius:10,
        borderColor:'#707070',
        borderWidth:1,
    },
    primaryButtonText:{
        color:'#FFFFFF',
        fontSize:14,
        fontFamily:"Medium",
    }
})
export default TaxiArrived;