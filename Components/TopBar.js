import React , { Component } from 'react';
import { View , Text , Dimensions , TouchableOpacity , Image } from 'react-native';

const {width,height} = Dimensions.get('window');

class TopBar extends Component{
    state = {

    }

    render(){
        const isBack = this.props.leftIcon
        let button;

        if(isBack === "back"){
            button = <TouchableOpacity onPress={this.props.ShowMenu}>
            <Image source={require('../assets/left-arrow.png')} style={{width:28,height:28,transform:[{rotate:"180deg"}]}}/>
        </TouchableOpacity>;
        } else {
            button = <TouchableOpacity onPress={this.props.ShowMenu} disabled={this.props.disable === true ? true : false} style={this.props.disable === true ? {opacity:0} : {opacity:1}}>
            <Image source={require('../assets/menu.png')} style={{width:28,height:28,transform:[{rotate:"180deg"}]}}/>
        </TouchableOpacity>;
        }

        return(
            <View style={{width:width,paddingLeft:10,paddingRight:10,flexDirection:"row",height:70,backgroundColor:"#2a2e43",alignItems:'center',justifyContent:'space-between',position:'relative'}}>
                <TouchableOpacity>
                    <View style={{width:28}}/>
                </TouchableOpacity>
                <View>
                    <Text style={{color:"#FFFFFF",fontSize:16,fontFamily:"Medium",}}>
                        {this.props.title}
                    </Text>
                </View>
                {button}
            </View>
        )
    }
}

export default TopBar;