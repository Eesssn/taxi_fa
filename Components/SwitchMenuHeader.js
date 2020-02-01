import React , { Component } from 'react';
import { View , Text , TouchableOpacity , StyleSheet , Dimensions } from 'react-native';

class SwitchMenuHeader extends Component{
    constructor(){
        super();
        this.state = {

        }
    }
    render(){
        return(
            <View style={{width:width}}>
                <View>
                    <TouchableOpacity 
                        style={styles.registerBtn}
                        onPress={this.props.renderResults}
                    >
                        <Text style={styles.registerBtnText}>
                            برو به {this.props.navigate}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    registerBtn:{
        paddingVertical:7,
        margin:10,
        paddingHorizontal:15,
        alignSelf:'flex-start',
        borderRadius:40,
        backgroundColor:"#fff",
    },
    registerBtnText:{
        fontFamily:"Medium",
        textAlign:"center",
        color:"#2a2e43",
        marginVertical:9,
    }
})
export default SwitchMenuHeader;