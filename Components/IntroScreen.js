import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native';

class IntroScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={
                {
                    width:width,
                    height:height,
                    marginTop:StatusBar.currentHeight,
                    position: 'relative'
                }
            }>
                <Image style={
                    {
                        width:width,
                        height:(height / 3) + 70,
                        alignSelf:'center',
                        marginVertical:10,
                        marginTop:20
                    }
                }
                       source={Gif}/>
                <Text style={
                    {
                        fontSize:20,
                        fontFamily:"Medium",
                        alignSelf:'center',
                        textAlign:'center',
                        marginTop:20
                    }
                }> به تاکسی مسیر خوش آمدید </Text>
                <TouchableOpacity style={
                    {
                        position: 'absolute',
                        bottom:100,
                        alignSelf:'center',
                        width:180,
                        height:60,
                        borderRadius:30,
                        backgroundColor:'#2a2e43',
                        justifyContent:'center'
                    }
                } onPress={this.props.IntroClick}>
                    <Text style={
                        {
                            color:'white',
                            fontFamily:"Medium",
                            alignSelf:'center',
                            textAlign:'center'
                        }
                    }>
                        ادامه
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const {width , height} = Dimensions.get('window');
const Gif = require('../assets/taxi.gif');
export default IntroScreen;
