import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Axios from 'axios';
var { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardno: {
    marginLeft: 5,
    marginRight: 5,
    color: "#fff",
    fontSize: 18
  },
  container: {
    position: 'relative'
  },
  imageHolder: {
    position: 'relative',
    alignItems: 'center'
  },
  imageView: {
    width: width / 10 * 8,
    marginTop: height / 8,
    height: height / 4
  },
  cardHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80
  },
  nameHolder: {
    position: 'absolute',
    bottom: 20, left: 50
  },
  nameValue: {
    fontFamily:"Medium",
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold'
  },
  dateHolder: {
    position: 'absolute',
    bottom: 20,
    right: 70
  },
  dateValue: {
    color: "#fff",
    fontSize: 16
  },
  cardInput: {
    color: '#fff',
    borderBottomColor: '#fff',
    borderBottomWidth: 1.5,
    width: width / 6,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
    padding: 10,
    fontSize: 20
  },
  inputContainer: {
    position: 'relative',
  },
  cardPasswordInput: {
    color: '#fff',
    borderBottomColor: '#fff',
    borderBottomWidth: 1.5,
    width: width / 7 * 4,
    marginTop: 10,
    marginLeft: width / 5,
    marginRight: 10,
    marginBottom: 5,
    padding: 10,
    fontSize: 20
  },
  cardCVVInput: {
    color: '#fff',
    borderBottomColor: '#fff',
    borderBottomWidth: 1.5,
    width: width / 6,
    marginTop: 10,
    marginRight: width / 5,
    marginBottom: 5,
    padding: 10,
    fontSize: 20
  },
  cardDateInput: {
    marginLeft:10,
    color: '#fff',
    borderBottomColor: '#fff',
    borderBottomWidth: 1.5,
    width: 80,
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    fontSize: 20
  },
  enterBtn: {
    width: width / 3 * 2,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginTop: 20
  },
  enterBtnText: {
    fontFamily:"Medium",
    textAlign: "center",
    color: "#2A2E43",
    marginTop: 13,
    fontSize: 20,
    fontWeight: '300',
  }
})


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardHolder: '',
      cardno1: '',
      cardno2: '',
      cardno3: '',
      cardno4: '',
      cvv: '',
      cardYear: '',
      cardMonth: '',
    }
  }

  componentWillMount() {
    this.setState({
      cardHolder: this.props.name
    })
  }

  submit = () => {
    var mago = this.state;
    var that = this;
    if(mago.cvv && mago.cardMonth && mago.cardYear && mago.cardno1 && mago.cardno2 && mago.cardno3 && mago.cardno4 && mago.cardHolder){
        Axios.post('passenger/card',{
            card_number:mago.cardno1.toString() + mago.cardno2.toString() + mago.cardno3.toString() + mago.cardno4.toString(),
            expire_year:mago.cardYear,
            expire_month:mago.cardMonth,
            cvv:mago.cvv,
            passenger_id:that.props.PassengerId,
            token:that.props.Token,
        }).then(function(response){
            if(response.data.is_successful){
                that.props.PageSwitcher()
            } else {
                alert(response.data.message)
            }
        }).catch(function(e){
        })
    } else {
        alert('fill all inputs')
    }
}

  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.imageHolder}>
            <Image source={require('../assets/Card.png')} style={styles.imageView} />
            <View style={styles.cardHolder}>
              <Text style={styles.cardno}>{this.state.cardno1}</Text>
              <Text style={styles.cardno}>{this.state.cardno2}</Text>
              <Text style={styles.cardno}>{this.state.cardno3}</Text>
              <Text style={styles.cardno}>{this.state.cardno4}</Text>
            </View>
          </View>
          <View style={styles.nameHolder}>
            <Text style={styles.nameValue}>
              {this.props.name}
            </Text>
          </View>
          <View style={styles.dateHolder}>
            <Text style={styles.dateValue}>
              {this.state.cardMonth}/{this.state.cardYear}
            </Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={{ color: "#FFF", fontSize: 18, marginTop: 20, marginLeft: 45 , fontFamily:"Medium"}}>
              شماره کارت
                        </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
              style={styles.cardInput}
              value={this.state.cardno1}
              onChangeText={(cardno1) => this.setState({ cardno1 })}
              placeholder="XXXX"
              placeholderTextColor="#ffffff50"
              maxLength={4}
              keyboardType={'number-pad'}
              onSubmitEditing={() => { this.cardno2.focus(); }}
              blurOnSubmit={false}
            />
            <TextInput
              style={styles.cardInput}
              value={this.state.cardno2}
              onChangeText={(cardno2) => this.setState({ cardno2 })}
              placeholder="XXXX"
              placeholderTextColor="#ffffff50"
              maxLength={4}
              keyboardType={'number-pad'}
              onSubmitEditing={() => { this.cardno3.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.cardno2 = input; }}
            />
            <TextInput
              style={styles.cardInput}
              value={this.state.cardno3}
              onChangeText={(cardno3) => this.setState({ cardno3 })}
              placeholder="XXXX"
              placeholderTextColor="#ffffff50"
              maxLength={4}
              keyboardType={'number-pad'}
              onSubmitEditing={() => { this.cardno4.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.cardno3 = input; }}
            />
            <TextInput
              style={styles.cardInput}
              value={this.state.cardno4}
              onChangeText={(cardno4) => this.setState({ cardno4 })}
              placeholder="XXXX"
              placeholderTextColor="#ffffff50"
              maxLength={4}
              onBlur={() => this.setState({
                completeCard:this.state.cardno1+
                this.state.cardno2+
                this.state.cardno3+
                this.state.cardno4
              })}
              keyboardType={'number-pad'}
              ref={(input) => { this.cardno4 = input; }}
            />
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
              style={styles.cardCVVInput}
              secureTextEntry={true}
              value={this.state.cvv}
              onChangeText={(cvv) => this.setState({ cvv })}
              placeholder="CVV"
              placeholderTextColor="#ffffff50"
              keyboardType={'number-pad'}
            />
          </View>
        </View>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: "#FFFFFF50" }}>
              Card Expire Date
            </Text>
            <TextInput
              style={styles.cardDateInput}
              value={this.state.cardMonth}
              onChangeText={(cardMonth) => this.setState({ cardMonth })}
              placeholder="MM"
              maxLength={2}
              placeholderTextColor="#ffffff50"
              keyboardType={'number-pad'}
            />
            <TextInput
              style={styles.cardDateInput}
              value={this.state.cardYear}
              onChangeText={(cardYear) => this.setState({ cardYear })}
              placeholder="YY"
              maxLength={2}
              placeholderTextColor="#ffffff50"
              keyboardType={'number-pad'}
            />
          </View>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={styles.enterBtn} onPress={() => this.submit()}>
            <Text style={styles.enterBtnText}>
              تایید کارت بانکی
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
export default App;