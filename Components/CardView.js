import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

class CardView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        var DATA = this.props.data.item;
        return (
            <TouchableOpacity onLongPress={this.props.delete} onPress={this.props.click} style={styles.container}>
                <View style={styles.imageHolder}>
                    <Image source={require('../assets/cardHolder.png')} style={styles.imageView} />
                    <View style={styles.cardHolder}>
                        <Text style={styles.cardno}>****</Text>
                        <Text style={styles.cardno}>****</Text>
                        <Text style={styles.cardno}>****</Text>
                        <Text style={styles.cardno}>{DATA.last_four}</Text>
                    </View>
                </View>
                <View style={styles.dateHolder}>
                    <Text style={styles.dateValue}>
                        {DATA.expire_month}/{DATA.expire_year}
                    </Text>
                </View>
                <View style={styles.ActionHolder}>
                    <TouchableOpacity onPress={this.props.onDelete} style={{marginHorizontal:7,backgroundColor:"rgba(0,0,0,0.3)",width:40,height:40,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
                        <Image style={{width:20,height:20}} source={require('../assets/deleteW.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.setAsDefault} style={{marginHorizontal:7,flexDirection:'row-reverse',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:"white",fontFamily:"Medium",}}>{DATA.is_default === 1 ? "کارت اصلی" : ""}</Text>
                        <View style={{marginRight:10 , width:30,height:30,borderRadius:15,borderWidth:0.5,borderColor:'black',backgroundColor:DATA.is_default === 1 ? "white" : "transparent"}}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    cardno: {
        marginLeft: 5,
        marginRight: 5,
        color: "#fff",
        fontSize: 18
    },
    container: {
        marginBottom:10,
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    imageHolder: {
        position: 'relative',
        alignItems: 'center'
    },
    imageView: {
        width: width / 10 * 8,
        height: 200,
        borderRadius: 10,
    },
    cardHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height:40,
        bottom:"45%",
        position: 'absolute',
    },
    nameHolder: {
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width:"60%",
        flexWrap:'wrap'
    },
    nameValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold'
    },
    ActionHolder:{
        position: 'absolute',
        left:"3%",
        bottom:"3%",
        flexDirection:'row'
    },
    dateHolder: {
        position: 'absolute',
        bottom: '10%',
        right: '10%',
    },
    dateValue: {
        color: "#fff",
        fontSize: 16
    }
})
export default CardView;
