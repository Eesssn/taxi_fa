import React, { Component } from 'react';
import { View, Image , Dimensions } from 'react-native';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Image source={require('../assets/loading.gif')} style={{width:width,height:width}} />
      </View>
    );
  }
}
const {width,height} = Dimensions.get('window')
export default Loading;
