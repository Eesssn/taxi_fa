import React , { Component } from 'react';
import { View , Text , ScrollView , StyleSheet , TouchableOpacity , Dimensions } from 'react-native';

class PayItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            transactions:[],
        }
    }
    renderTransactions = () => {
        return this.props.data !== null ?
        this.props.data.map((item,i) => {
            return(
                <View style={styles.Container} key={i}>
                    <View style={styles.Row}>
                        <Text style={styles.Header}>
                            شناسه پرداخت
                        </Text>
                        <Text style={styles.Title}>
                            {item.transaction_id}
                        </Text>
                    </View>
                    <View style={styles.Row}>
                        <Text style={styles.Header}>
                            شماره سفر
                        </Text>
                        <Text style={styles.Title}>
                            {item.ride_id}
                        </Text>
                    </View>
                    <View style={styles.Row}>
                        <Text style={styles.Header}>
                            هزینه
                        </Text>
                        <Text style={styles.Title}>
                            {item.cost} تومان
                        </Text>
                    </View>
                    <View style={styles.DateHolder}>
                        <Text>
                            {item.date}
                        </Text>
                    </View>
                </View>
            )
        }) : <View>
            <Text>درحال دریافت اطلاعات</Text>
        </View>
    }
    render(){
        return(
            <ScrollView>
                {this.renderTransactions()}
            </ScrollView>
        )
    }
}
const {width , height} = Dimensions.get('window');
const styles = StyleSheet.create({
    Container:{
        borderColor:'#707070',
        borderWidth:0.5,
        backgroundColor:'#ffffff',
        borderRadius:10,
        width:width / 100 * 80,
        marginHorizontal: width / 100 * 10,
        marginVertical:10,
        position:'relative',
        paddingTop:20,
    },
    Row:{
        paddingHorizontal:10,
        marginVertical:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    DateHolder:{
        position:'absolute',
        top:-10,
        right:20,
        padding:5,
        borderRadius:20,
        borderColor:'#707070',
        borderWidth:0.2,
        backgroundColor:'#ffffff'
    },
    ReportBtn:{
        backgroundColor:'#2a2e43',
        paddingHorizontal:10,
        paddingVertical:10,
        borderRadius:30,
    },
    ReportBtnTxt:{
        color:'#ffffff',
        fontFamily:"Medium",
    },
    Header:{
        fontFamily:"Medium",
        fontSize:14
    },
    Title:{
        fontFamily:"Medium",
        fontSize:13,
    }
})
export default PayItem;