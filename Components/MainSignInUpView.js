import React , { Component } from 'react';
import { View , StyleSheet } from 'react-native';
import Login from './login';
import Register from './register';
import SwitchMenuHeader from './SwitchMenuHeader';

class Hello extends Component{
    constructor(){
        super();
        this.state = {
            showRegister:false,
        }
    }
    renderResults = () =>{
        this.setState({
          showRegister:!this.state.showRegister
        })
      } 

    render(){
        return(
            <View style={styles.container}>
                {this.state.showRegister
                    ?
                        <Register
                            PageSwitcher={() => this.renderResults()}
                            renderResults={this.renderResults}
                        />
                    :
                        <Login
                            CanLogin={this.props.CanLogin}
                            LogPassword={this.props.LogPassword}
                            renderResults={this.renderResults}
                            phoneCh={this.props.phoneCh}
                            refrence={this.props.refrence}
                            SendLogRequest={this.props.SendLogRequest}
                            LogPhoneVal={this.props.LogPhoneVal}
                            LogPasswordVal={this.props.LogPasswordVal}
                            conRefrence={this.props.conRefrence}
                            onPressFlag={this.props.onPressFlag}
                            selectCountry={this.props.selectCountry}
                            cca2={this.props.cca2}
                        />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#2A2E43",
        flex:1,
        position:'relative'
    }
})
export default Hello;