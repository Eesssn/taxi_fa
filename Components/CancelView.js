import React , { Component } from 'react';
import { View , Text , TouchableOpacity , StyleSheet , Dimensions } from 'react-native';

class CancelView extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <View style={styles.Container}>
                <View style={styles.Manager}>
                    <Text style={styles.title}>
                        Are you sure ?
                    </Text>
                    <View style={styles.ButtonContainer}>
                        <TouchableOpacity style={styles.Button} onPress={this.props.no}>
                            <Text style={styles.text}>
                                No
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.PrimaryButton} onPress={this.props.yes}>
                            <Text style={styles.PrimaryButtonText}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const { width , height } = Dimensions.get('window');
const styles = StyleSheet.create({
    Container:{
        width:width,
        height:(height / 4),
        alignItems:'center',
        justifyContent:'center',
        paddingBottom:50,
    },
    Manager:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
    },
    title:{
        fontFamily:"Medium",
        fontSize:20,
        marginBottom:20,
    },
    ButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        width:width,
    },
    Button:{
        width:width / 100 * 40,
        borderWidth:1,
        borderColor:'#777777',
        borderRadius:10,
        padding:15,
    },
    PrimaryButton:{
        width:width / 100 * 40,
        backgroundColor:'#2a2e43',
        borderRadius:10,
        padding:15,
    },
    PrimaryButtonText:{
        fontFamily:"Medium",
        color:'#fff',
        textAlign:'center',
    },
    text:{
        fontFamily:"Medium",
        textAlign:'center',
    }
})
export default CancelView;