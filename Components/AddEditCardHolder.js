import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity , Dimensions , StyleSheet } from 'react-native';
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{flexDirection:'row',alignItems:'center',justifyContent:'center',height:50,width:width,borderBottomColor:'#E9E9E9',borderBottomWidth:1,marginBottom:10},
    button:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginRight:20},
    image:{ width: 32, height: 32 , marginRight:10 }
})
class AddEditCardHolder extends Component {
    state = {

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.props.change}>
                    <Image source={require('../assets/plus.png')} style={styles.image}/>
                    <Text style={{fontFamily:"Medium",}}>
                        افزودن کارت جدید
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default AddEditCardHolder;