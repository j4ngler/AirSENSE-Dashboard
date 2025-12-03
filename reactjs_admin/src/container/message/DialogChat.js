import React, {Component} from 'react'
import Launcher from '../../compoment/chat/boot/components/Launcher';
import {render} from 'react-dom';
import messageHistory from '../../compoment/chat/boot/messageHistory';
import '../../compoment/chat/boot/assets/styles';
import '../../compoment/chat/boot/styles';
import { connect } from 'react-redux';
import * as actions from '../../actions/message-info';
import PropTypes from 'prop-types';
import mqtt from 'mqtt';
import ManagerData from '../../actions/ManagerData.js'


class DialogChat extends Component {
 // https://github.com/kingofthestack/react-chat-window
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
             messageList: [
              {type: 'text', author: 'me', data: { text: "Why don't they have salsa on the table?"} },
              {type: 'text', author: 'them', data: { text: 'What do you need salsa for?'} },
              {type: 'text', author: 'me', data: { text: 'Salsa is now the number one condiment in America.'} },
              {type: 'text', author: 'them', data: { text: "You know why? Because people like to say 'salsa.' 'Excuse me, do you have salsa?' 'We need more salsa.' 'Where is the salsa? No salsa?'"} },
              {type: 'text', author: 'me', data: { text: "You know it must be impossible for a Spanish person to order seltzer and not get salsa. 'I wanted seltzer, not salsa.'"} },
              {type: 'text', author: 'them', data: { text: "Don't you know the difference between seltzer and salsa?? You have the seltezer after the salsa!"} },
              {type: 'text', author: 'me', data: { text: 'See, this should be a show. This is the show. '} },
              {type: 'text', author: 'them', data: { text: 'What?'} }, 
              {type: 'emoji', author: 'me', data: { emoji: '😋'} },
              {type: 'file', author: 'me',
                imageUrl: 'https://i.pinimg.com/originals/eb/b0/2a/ebb02aedec9bc74f65e38311c7e14d34.png',
                data: {
                  url: 'https://i.pinimg.com/originals/eb/b0/2a/ebb02aedec9bc74f65e38311c7e14d34.png',
                  fileName: 'bigBlue.png'
                }
              },
      ]


    };

    this.client =null;
    this.config=null;
  }

  componentDidMount(){
    if(ManagerData.mqtt.isloaded){
      this.config={
        port:ManagerData.mqtt.port,
        clientId : 'message_' + Math.random().toString(16).substr(2, 8),
        username : ManagerData.mqtt.username,
        useNewUrlParser: true,
        password: ManagerData.mqtt.password
      };

      this.client = mqtt.connect(ManagerData.mqtt.mqtt , this.config);
      
      this.client.on('connect', () =>{
        ManagerData.mqtt.client =this.client;
        this.client.subscribe(ManagerData.mqtt.topic_pub, function (err) {
          if (!err) {
              console.log("Connect mqtt successfully in port:", config.port);
          }
          else
              console.log(err);
        });
      });
      this.client.on('message', (topic, payload, packet) => {

      });

    }
    
  }


/*
 {
                    imageUrl: null,
                    imageAlt: null,
                    messageText: action.textMessage,
                    createdAt: 'Apr 16',
                    isMyMessage: true
                },*/
  _onMessageWasSent(message) {
    const {dispatch} = this.props;
    console.log("message .....",message);
    dispatch(actions.newMessageAdded(message));
    this.setState({
      messageList: [...this.state.messageList, message]
    })
  }

  _sendMessage(text) {
    const {dispatch} = this.props;

    console.log("message ...text..",text);
    if (text.length > 0) {
      var data= {
        author: 'them',
        type: 'text',
        data: { text }
      };
      dispatch(actionsMesage.sendMessage(data));
      this.setState({
        messageList: [...this.state.messageList, data]
      })
    }
  }

  render() {
    return (<div  style={{position:"fixed", zIndex: 999}}>
      <Launcher
        agentProfile={{
          teamName: 'react-chat-window',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
      />
    </div>)
  }
}
const mapDispatchToProps = dispatch => {
  return { dispatch };
}
export default connect(
  mapDispatchToProps
)  (DialogChat);