import React, {Component} from 'react'
import { connect } from 'react-redux';
import * as actions from '../../actions/message-info';
import PropTypes from 'prop-types';
import DialogChat from './DialogChat.js'
import ManagerData from '../../actions/ManagerData.js'

class FooterChat extends Component {
 // https://github.com/kingofthestack/react-chat-window
  constructor(props) {
    super(props);
    this.state = { islist:true};

  }

  componentDidMount(){
    ManagerData.getInfoUser();
  }

  render() {
    const {dispatch,inChatbox} = this.props;
      console.log("inChatBox ......... ",inChatbox);
    return (<div>
               {inChatbox?"": <DialogChat/>}
            </div>
            );
  }
}
const mapDispatchToProps = dispatch => {
  return { dispatch };
}
const mapStateToProps = state => {
    return {inChatbox: state.messageInfo.messageInfo.inChatbox}

}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)  (FooterChat);