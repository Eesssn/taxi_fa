import React , { Component } from 'react';
import { View , Text , Dimensions , Image , TouchableOpacity , StyleSheet } from 'react-native';
class ChooseTaxiType extends Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    priceTrimmer(number) {
        var numbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    
        number += '';
        number = number.replace(',', '');
        number = number.replace(',', '');
        number = number.replace(',', '');
        number = number.replace(',', '');
        number = number.replace(',', '');
        number = number.replace(',', '');
        var x = number.split('.');
        var y = x[0];
        var z = x.length > 1 ? '.' + x[1] : '';
        var regex = /(\d+)(\d{3})/;
        while (regex.test(y)) y = y.replace(regex, '$1' + ',' + '$2');
        var price = y + z;
    
        return price.replace(/[0-9]/g, function(w) {
          return numbers[+w];
        });
      }

    render(){
        const { ValueTaxiType } = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    {this.props.TempTaxiType
                        ?
                        <View>
                            <View style={styles.mRow}>
                                <View style={styles.mRow}>
                                    <Image source={require('../assets/passenger.png')} style={{width:24,height:24,marginRight:7}} />
                                    <Text style={styles.text}>{this.priceTrimmer(this.props.TempTaxiType.capacity)} ظرفیت مسافر</Text>
                                </View>
                                <View style={styles.mRow}>
                                    <Image source={require('../assets/suitcase.png')} style={{width:24,height:24,marginRight:7}} />
                                    <Text style={styles.text}>{this.priceTrimmer(this.props.TempTaxiType.suitcases)}گنجایش بار</Text>
                                </View>
                            </View>
                            <View style={styles.mRow}>
                                <Text style={{fontFamily:"Medium",}}>هزینه سفر: {this.priceTrimmer(this.props.TempTaxiType.price)} تومان</Text>
                            </View>
                        </View>
                        :
                        <Text style={{fontFamily:"Medium",textAlign: "center"}}>نوع سرویس مورد نظر خود را انتخاب کنید</Text>
                        }
                </View>
                <View style={styles.taxiHolder}>
                    {this.props.Cars.map(item => {
                        return(
                            <View key={item.id}>
                                <TouchableOpacity style={styles.taxiButtons} onPress={() => this.props.selector(item)}>
                                    <Image source={{uri:item.icon}} style={styles.taxiImage}/>
                                    <Text style={styles.taxiText}>
                                       {item.title}
                                    </Text>
                                </TouchableOpacity>
                            {ValueTaxiType === item.id && <View style={styles.Checked}/>}
                            </View>
                        )
                    })}
                </View>
                <View style={styles.buttonsHolder}>
                    {this.props.voucherStatus ? <TouchableOpacity disabled={true} style={styles.promocodeButton} >
                        <Text style={[styles.text,{color:"green"}]}>
                            کد تخفیف قبول شد
                        </Text>
                    </TouchableOpacity> : <TouchableOpacity style={styles.promocodeButton} onPress={this.props.PromoCode}>
                        <Text style={styles.text}>
                            کد تخفیف ?
                        </Text>
                    </TouchableOpacity>}
                    <TouchableOpacity style={styles.nextButton} onPress={this.props.TakeNote}>
                        <Text style={styles.text}>
                            بعدی
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    PromoAccepted:{
        fontFamily:"Medium",
        backgroundColor:"#94e090",
        paddingHorizontal:15,
        paddingVertical:7,
        borderRadius:5,
        marginHorizontal:10,
    },
    PromoAcceptedText:{
        fontFamily:"Medium",
        color:"#194217"
    },
    container:{
        paddingBottom:50
    },
    mRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        marginBottom:15,
    },
    mColumn:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    Checked:{
        position:'absolute',
        borderRadius:15,
        top:0,
        right:0,
        width:"100%",
        height:"100%",
        backgroundColor:'#2a2e4355',
        zIndex:5,
        // shadowColor: "#000",
        // shadowOffset: {
        // 	width: 0,
        // 	height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
    header:{
        position:'relative',
        borderBottomColor:'#d7d7d7',
        borderBottomWidth:1,
        padding:10,
        marginTop:7,
        marginBottom:10,
    },
    headerButton:{
        position:'absolute',
        right:10,
        top:5,
    },
    headerTitle:{
        fontFamily:"Medium",
        textAlign:'center',
        fontSize:14,
    },
    noteToDriverIcon:{
        width:20,
        height:20,
    },
    taxiHolder:{
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
        zIndex:999
    },
    taxiButtons:{
        zIndex:999,
        padding:20,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-around',
        position:'relative',
    },
    taxiImage:{
        width:85,
        height:55,
    },
    taxiText:{
        fontFamily:"Medium",
        fontSize:14,
    },
    estimateHolder:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        marginTop:10,
        marginBottom:10,
    },
    estimateItem:{
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row'
    },
    estimateText:{
        fontFamily:"Medium",
        fontSize:12,
    },
    estimateSubText:{
        fontFamily:"Medium",
        fontSize:10,
        marginLeft:10,
    },
    buttonsHolder:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:15,
        marginBottom:20,
    },
    nextButton:{
        marginRight:10,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        borderWidth:1,
        borderColor:'#707070',
        backgroundColor:'#d7d7d7',
        borderRadius:10,
    },
    promocodeButton:{
        marginLeft:30
    },
    text:{
        writingDirection:"rtl",
        fontFamily:"Medium",
        fontSize:14
    },
})

export default ChooseTaxiType;