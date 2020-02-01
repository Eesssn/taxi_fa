import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import TopBar from './TopBar';
import Axios from 'axios';

const { width } = Dimensions.get('window');



export default class App extends Component {
  state = {
    activeSections: [],
    collapsed: true,
    multipleSelect: true,
    activeContent:true,
    Note:'',
    CONTENT:this.props.data,
  };

  submitNewQuestion = () => {
    var that = this;
    Axios.post('question',{
      passenger_id:this.props.passenger_id,
      token:this.props.token,
      question:this.state.Note
    }).then(function(response){
      if(response.data.is_successful){
        alert('سوال شما ثبت شد')
        that.setState({
          activeContent:true
        })
      } else {
        alert(response.data.message)
      }
    }).catch(function(err){
    })
  }  

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Text style={[styles.headerText , isActive ? styles.activeText : styles.inactiveText]}>{section.title}</Text>
      </Animatable.View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
          {section.answer}
        </Animatable.Text>
      </Animatable.View>
    );
  }

  render() {
    const { multipleSelect, activeSections } = this.state;

    return (
      <View style={styles.container}>
        <TopBar title="پشتیبانی" leftIcon="back" ShowMenu={this.props.ShowMenu}/>
        {this.state.activeContent
            ?
            <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
              <Accordion
                activeSections={activeSections}
                sections={this.state.CONTENT}
                touchableComponent={TouchableOpacity}
                expandMultiple={multipleSelect}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                duration={400}
                onChange={this.setSections}
              />
            </ScrollView>
            :
            <View>
                <TextInput
                    multiline = {true}
                    numberOfLines = {5}
                    onChangeText={(Note) => this.setState({Note})}
                    value={this.state.Note}
                    placeholder="سوال خود را بپرسید"
                    style={styles.TextInputStyle}
                />
                <TouchableOpacity onPress={() => this.submitNewQuestion()} style={styles.submitButton}>
                    <Text style={[styles.submitButtonText,{fontFamily:"Medium",}]}>
                        ثبت
                    </Text>
                </TouchableOpacity>
            </View>
        }
            {this.state.activeContent
                ?
                <TouchableOpacity style={styles.askButton} onPress={() => this.setState({activeContent:false})}>
                    <Text style={[styles.askButtonText,{fontFamily:"Medium",}]}>
                        سوال شما پیدا نشد؟ بپرسید
                    </Text>
                </TouchableOpacity>
                :
                null
            }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#2a2e43',
        position:'relative',
        flex:1,
        alignItems:'center',
        justifyContent:'flex-start'
    },
    submitButton:{
        width:width / 100 * 80,
        backgroundColor:'#ffffff',
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:30,
        paddingRight:30,
        marginTop:15,
        marginBottom:15,
        borderRadius:10,
        marginLeft: width / 100 * 5
  },
    submitButtonText:{
        color:'#2a2e43',
        fontFamily:"Medium",
        textAlign:'center',
  },
    TextInputStyle:{
        fontFamily:"Medium",
        width:width/100*90,
        padding:10,
        borderColor:'#707070',
        backgroundColor:'#d7d7d7',
        color:'#000',
        marginTop:12,
        marginBottom:20,
        borderRadius:10,
  },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontFamily:"Medium",
        marginBottom: 20,
  },
    header: {
        backgroundColor: '#2A2E43',
        padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
      fontFamily:"Medium",
  },
  inactiveText:{
    color:'#ffffff',
      fontFamily:"Medium",
  },
  activeText:{
    color:'#2a2e43',
      fontFamily:"Medium",
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: '#2A2E43',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#2A2E43',
    padding: 10,
  },
  activeSelector: {
      fontFamily:"Medium",
  },
  selectTitle: {
    fontSize: 14,
      fontFamily:"Medium",
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
      fontFamily:"Medium",
  },
  askButton:{
      backgroundColor:'#ffffff',
      padding:20,
      borderRadius:50,
      position:'absolute',
      bottom:20,
      left:10,
  },
  askButtonText:{
      color:'#2a2e43',
      textAlign:'center',
      fontFamily:"Medium",
  }
});