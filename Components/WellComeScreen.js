import React , { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Animated , { Easing } from 'react-native-reanimated';
import SVG , { Image , Circle , ClipPath } from 'react-native-svg'
import {TapGestureHandler , State} from 'react-native-gesture-handler'

const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat
} = Animated
const {width , height } = Dimensions.get('window');
function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease),
    };
  
    return block([
      cond(clockRunning(clock), [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
          set(config.toValue, dest),
      ], [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ]),
      // we run the step here that is going to update position
      timing(clock, state, config),
      // if the animation is over we stop the clock
      cond(state.finished, debug('stop clock', stopClock(clock))),
      // we made the block return the updated position
      state.position,
    ]);
  }
class WellComeScreen extends Component {
    constructor(props){
        super(props);
        this.buttonOpacity = new Value(1)
        this.onStateChange = event([
            {
                nativeEvent:({state}) => block([
                    cond(eq(state,State.END),set(this.buttonOpacity,runTiming( new Clock() , 1 , 0)))
                ])
            }
        ]);
        this.onStateChange2 = event([
            {
                nativeEvent:({state}) => block([
                    cond(eq(state,State.END),set(this.buttonOpacity,runTiming( new Clock() , 1 , 0)))
                ])
            }
        ],this.setState({Shot:'register'}));
        this.onCloseState = event([
            {
                nativeEvent:({state}) => block([
                    cond(eq(state,State.END),set(this.buttonOpacity,runTiming( new Clock() , 0 , 1)))
                ])
            }
        ]);
        this.onCloseState2 = event([
            {
                nativeEvent:({state}) => block([
                    cond(eq(state,State.END),set(this.buttonOpacity,runTiming( new Clock() , 0 , 1)))
                ])
            }
        ])
        this.buttonY = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[100,0],
            extrapolate:Extrapolate.CLAMP
        })
        this.bgY = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[-height/3-50,0],
            extrapolate:Extrapolate.CLAMP
        })
        this.textInputZindex = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[1,-1],
            extrapolate:Extrapolate.CLAMP
        })
        this.textInputY = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[0,100],
            extrapolate:Extrapolate.CLAMP
        })
        this.textInputOpacity = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[1,0],
            extrapolate:Extrapolate.CLAMP
        })
        this.rotateCross = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[180,360],
            extrapolate:Extrapolate.CLAMP
        })
        this.textInputZindex2 = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[1,-1],
            extrapolate:Extrapolate.CLAMP
        })
        this.textInputY2 = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[0,100],
            extrapolate:Extrapolate.CLAMP
        })
        this.textInputOpacity2 = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[1,0],
            extrapolate:Extrapolate.CLAMP
        })
        this.rotateCross2 = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[180,360],
            extrapolate:Extrapolate.CLAMP
        })
        this.state = {
            Shot:'login'
        }
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'white',justifyContent:'flex-end'}}>
                <Animated.View style={{...StyleSheet.absoluteFill,transform:[{translateY:this.bgY}]}}>
                    <SVG height={height+50} width={width}>
                        <ClipPath id="clip">
                            <Circle
                                r={height+50}
                                cx={width/2}
                            />
                        </ClipPath>
                        <Image
                            href={require('../assets/bg.jpg')}
                            width={width}
                            height={height+50}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#clip)"
                        />
                    </SVG>
                </Animated.View>
                <View style={{height:height/3,justifyContent:'center'}}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View style={{...styles.button,opacity:this.buttonOpacity,transform:[{translateY:this.buttonY}]}}>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>SIGN IN</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange2}>
                        <Animated.View style={{...styles.button,backgroundColor:'#2a2e43',opacity:this.buttonOpacity,transform:[{translateY:this.buttonY}]}}>
                            <Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>SIGN UP</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <Animated.View style={{
                        height:height/3,
                        ...StyleSheet.absoluteFill,
                        top:null,
                        justifyContent:'center',
                        zIndex:this.textInputZindex,
                        opacity:this.textInputOpacity,
                        transform:[{translateY:this.textInputY}]
                        }}>
                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{fontSize:15,transform:[{rotate:concat(this.rotateCross,'deg')}]}}>
                                    X
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <TextInput
                            placeholder="PHONE NUMBER"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            keyboardAppearance="light"
                            keyboardType="number-pad"
                            maxLength={15}
                        />
                        <TextInput
                            placeholder="PASSWORD"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            secureTextEntry={true}
                            keyboardType="default"
                        />
                        <Animated.View style={{...styles.button,backgroundColor:'#2a2e43'}}>
                            <Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>
                                SIGN IN
                            </Text>
                        </Animated.View>
                    </Animated.View>
                    <Animated.View style={{
                        height:height/2,
                        ...StyleSheet.absoluteFill,
                        top:null,
                        justifyContent:'center',
                        zIndex:this.textInputZindex2,
                        opacity:this.textInputOpacity2,
                        transform:[{translateY:this.textInputY2}]
                        }}>
                        <TapGestureHandler onHandlerStateChange={this.onCloseState2}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{fontSize:15,transform:[{rotate:concat(this.rotateCross2,'deg')}]}}>
                                    X
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <TextInput
                            placeholder="PHONE NUMBER"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            keyboardAppearance="light"
                            keyboardType="number-pad"
                            maxLength={15}
                        />
                        <TextInput
                            placeholder="FULL NAME"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            keyboardType="default"
                        />
                        <Animated.View style={{...styles.button,backgroundColor:'#2a2e43'}}>
                            <Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>
                                NEXT
                            </Text>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    button:{
        backgroundColor:'white',
        height:70,
        marginHorizontal:20,
        borderRadius:35,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:5,
        shadowColor: "#000",
        shadowOffset: {
        	width: 2,
        	height: 2,
        },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    textInput:{
        height:50,
        borderRadius:25,
        borderWidth:0.5,
        marginHorizontal:20,
        paddingLeft:10,
        marginVertical:5,
        borderColor:'#707070',
    },
    closeButton:{
        height:40,
        width:40,
        backgroundColor:'white',
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:-20,
        left:width/2 - 20,
        shadowColor: "#000",
        shadowOffset: {
        	width: 2,
        	height: 2,
        },
        shadowOpacity: 0.2,
        elevation: 5,
    }
})
export default WellComeScreen;