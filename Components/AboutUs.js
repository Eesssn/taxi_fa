import React , { Component } from 'react';
import { View , Text , StyleSheet , Linking , Dimensions , TouchableOpacity } from 'react-native';
import TopBar from './TopBar';

class AboutUs extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    _openUrl(){
        Linking.openURL(url);
    }
    render(){
        return(
            <View style={styles.container}>
                <TopBar title="قوانین و سیاست ها" leftIcon="back" ShowMenu={this.props.ShowMenu}/>
                <Text style={styles.aboutText}>
                    درباره شرکت
                </Text>
            </View>
        )
    }
}
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flex:1,
        borderTopColor:'#707070',
        borderTopWidth:1,
        position:'relative',
        alignItems:'center',
        justifyContent:'flex-start',
        flexDirection:'column',
        backgroundColor:'#2A2E43',
    },
    aboutText:{
        fontFamily:"Medium",
        color:'#FFFFFF',
        marginTop:15,
        marginBottom:15,
        textAlign:'center',
        fontSize:14,
    },
    link:{
        position:'absolute',
        bottom:10,
    }
})
export default AboutUs;