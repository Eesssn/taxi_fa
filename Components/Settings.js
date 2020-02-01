import React , { Component } from 'react';
import { View } from 'react-native';
import TopBar from './TopBar';
import GeneralSettings from './GeneralSettings';
import SettingsView from './SettingsView';
import Favorite from './Favorite';

class General extends Component {
    constructor(props){
        super(props);
        this.state = {
            showPage:"main"
        }
    }

    _GoToGeneral(){
        this.setState({
            showPage:"general",
        })
    }

    _GoToMain(){
        this.setState({
            showPage:"main"
        })
    }

    render(){
        if(this.state.showPage === "main"){
            return(
                <View style={{flex:1 , backgroundColor:'#fff'}}>
                    <TopBar ShowMenu={this.props.ShowMenu} title="تنظیمات" leftIcon="back"/>
                    <SettingsView
                        GoToGeneral={() => this._GoToGeneral()}
                        GoToFavorite={() => this.setState({showPage:"favorite"})}    
                    />
                </View>                
            )
        }
        if(this.state.showPage === "general"){
            return(
                <View style={{flex:1 , backgroundColor:'#fff'}}>
                    <GeneralSettings
                        logout={this.props.logout}
                        getValuesFromAsync={this.props.getValuesFromAsync}
                        fullData={this.props.fullData}
                        Logout2={this.props.Logout2}
                        ShowMenu={() => this._GoToMain()}
                        Token={this.props.Token}
                        PassengerId={this.props.PassengerId}
                        Image={this.props.Image}
                        Name={this.props.Name}
                        Phone={this.props.Phone}
                        Email={this.props.Email}
                    />
                </View>
            )
        }
        if(this.state.showPage === "favorite"){
            return(
                <View style={{flex:1,backgroundColor:'#fff'}}>
                    <Favorite
                        Token={this.props.Token}
                        PassengerId={this.props.PassengerId}
                        ShowMenu={() =>this._GoToMain()}
                        addresses={this.props.addresses}
                    />
                </View>
            )
        }
    }
}


export default General;