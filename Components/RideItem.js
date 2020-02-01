import React , { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';

class RideItem extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    renderItems = () => {
        let items = [];
        this.props.data.map(item => {
            items.push(
                <TouchableOpacity key={item.id} style={styles.Card} onPress={() => this.props.click(item)}>
                    <View style={styles.Row}>
                        <Image source={require('../assets/start.png')} style={styles.Image}/>
                        <Text style={[styles.Title,{fontFamily:"Medium",}]}>
                            {item.info.from_address}
                        </Text>
                    </View>
                    <View style={styles.Row}>
                        <Image source={require('../assets/target.png')} style={styles.Image}/>
                        <Text style={[styles.Title,{fontFamily:"Medium",}]}>
                            {item.info.to_address}
                        </Text>
                    </View>
                    <View style={styles.DateContainer}>
                        <Text style={{fontFamily:"Medium",}}>
                            {item.created_at}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return items;
    }
    render(){
        return(
            <View>
                {this.renderItems()}
            </View>
        )
    }
}
const {width,height} = Dimensions.get('window');
const styles = StyleSheet.create({
    Card:{
        position:'relative',
        width:width / 100 * 80,
        marginHorizontal:width / 10,
        marginVertical: 20,
        borderRadius:10,
        borderColor:'#707070',
        borderWidth:0.5,
        padding:15,
        paddingTop:25,
    },
    Row:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginVertical:7,
    },
    Image:{
        width:20,
        height:20,
    },
    Title:{
        fontSize:12,
        fontFamily:"Medium",
    },
    DateContainer:{
        position:'absolute',
        top:-10,
        right:20,
        padding:10,
        borderRadius:30,
        borderColor:'#707070',
        borderWidth:0.2,
        backgroundColor:'#ffffff',
    }
})
export default RideItem;