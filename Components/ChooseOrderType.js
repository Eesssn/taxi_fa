import React , { Component } from 'react';
import { View , Text , ScrollView , Dimensions , ActivityIndicator , TouchableOpacity , StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

class ChooseOrderType extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.props.Places}>
                    <Text style={styles.buttonText}>
                        {this.props.title}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: width / 10 * 7,
        height: 80,
        position: 'absolute',
        bottom: (width / 100) * 10,
        // left:((width / 100) * 50) - 40,
        alignSelf:'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "transparent",
    },
    button:{
        marginVertical:10,
        padding:15,
        width:"100%",
        borderRadius:10,
        backgroundColor:'#2a2e43',
    },
    buttonText:{
        fontFamily:"Medium",
        color:'#ffffff',
        fontSize:16,
        textAlign:'center',
    },
    favoriteBtn:{
        paddingHorizontal:15,
        marginHorizontal:5,
    }
})

export default ChooseOrderType;