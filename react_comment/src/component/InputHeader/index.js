import Swal from 'sweetalert2';
import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';
import { EditorState, ContentState,RichUtils,Modifier  } from 'draft-js';
import Editor,{createEditorStateWithText} from '@draft-js-plugins/editor';
import createMentionPlugin, {defaultSuggestionsFilter,} from '@draft-js-plugins/mention';
import { useDispatch,useSelector } from 'react-redux';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import "draft-js/dist/Draft.css";
import "@draft-js-plugins/emoji/lib/plugin.css";
import './input.css'
import { login } from '../../reducers/Auth/authSlice';
import { tagUsers, uploadImage } from '../../reducers/Comment/commentSlice';
import InputComment from './Input';
var listUserData = null;

// // emotion
const emojiPlugin = createEmojiPlugin();
const { EmojiSelect } = emojiPlugin;


const InputCommentHeader = ({handleComment, infoReply}) => {
  const ref = useRef(null);
  const [editorState, setEditorState] = useState(createEditorStateWithText(''));
  const [avatar,setAvatar] = useState('')

   
    return (
    <>
        <div className='input-comment-header'>
          <p>Comments</p>
         
        <InputComment />
        </div>  
        <div>
          <div className='update'>
            <button className='popular'>Popular</button>
            <button className='newest'>Newest</button>
          </div>  
        </div> 
          
    </>
    )
}


export default InputCommentHeader;
