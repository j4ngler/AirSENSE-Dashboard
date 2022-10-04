import React, {useEffect} from 'react';
import './ListChatItem.css';

export default function ListChatItem(props) {

    const { photo, name} = props.data;
    return (
      <div className="sc-listchat-item">
        <img className="sc-listchat-item-photo" src={photo} alt="conversation" />
          <p className="sc-listchat-item-title">{ name }</p>
      </div>
    );
}