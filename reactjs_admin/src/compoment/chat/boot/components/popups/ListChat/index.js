import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './ListChat.css';
import ListChatItem from '../ListChatItem';
import LeftIcon from '../../../assets/left.png';
import RightIcon from '../../../assets/right.png'

export default function ListChat () {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    getConversations()
  },[])

 const getConversations = () => {
    axios.get('https://randomuser.me/api/?results=20').then(response => {
        let newConversations = response.data.results.map(result => {
          return {
            photo: result.picture.large,
            name: `${result.name.first} ${result.name.last}`
          };
        });
        setConversations([...conversations, ...newConversations])
    });
  }

  const [itemCount, setItemCount] = useState(0);

  const beforeItem = () => {
    if(itemCount!=0)  setItemCount(itemCount-5);
  }
  const afterItem = () => {
    if(itemCount + 8 < conversations.length)
    setItemCount(itemCount+5);
  }

    return (
            <div className='sc-listchat'>
              <div className='sc-listchat-control'>
            <div className='sc-listchat-left-button' onClick={beforeItem}>
              <img src={LeftIcon} alt='' />
            </div>
          {conversations[itemCount] ? 
            <ListChatItem
            key={conversations[itemCount].name}
            data={conversations[itemCount]} />:
            ''  
          }
          {conversations[itemCount+1] ? 
            <ListChatItem 
            key={conversations[itemCount+1].name}
            data={conversations[itemCount+1]} />:
            ''  
          }
          {conversations[itemCount+2] ? 
            <ListChatItem 
            key={conversations[itemCount+2].name}
            data={conversations[itemCount+2]} />:
            ''  
          }
          {conversations[itemCount+3] ? 
            <ListChatItem 
            key={conversations[itemCount+3].name}
            data={conversations[itemCount+3]} />:
            ''  
          }
          {conversations[itemCount+4] ? 
            <ListChatItem 
            key={conversations[itemCount+4].name}
            data={conversations[itemCount+4]} />:
            ''  
          }            
              <div className='sc-listchat-right-button' onClick={afterItem}>
              <img src={RightIcon} alt=''/>  
              </div>          
            </div>
            </div>
            );    
}
