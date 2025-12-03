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
import { login } from '../../../reducers/Auth/authSlice';
import { tagUsers, uploadImage } from '../../../reducers/Comment/commentSlice';
import '../input.css'
var listUserData = null;

// // emotion
const emojiPlugin = createEmojiPlugin();
const { EmojiSelect } = emojiPlugin;


const InputComment = ({handleComment, reply_id}) => {
  const ref = useRef(null);
  const [editorState, setEditorState] = useState(createEditorStateWithText(''));
  const [avatar, setAvatar] = useState(null);
  const [image, setImage] = useState('');
  const mentionsStyles = {
    color: 'blue'
  }
  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
    theme: mentionsStyles,
      mentionPrefix: '@',
      supportWhitespace: true,
    });

    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
      // eslint-disable-next-line no-shadow
      const plugins = mentionPlugin;
      return { plugins, MentionSuggestions };
    }, []);

    const allPlugins = [plugins, emojiPlugin];
    const checkKey=(e)=> {
      e = e || window.event;
      
      if (e.keyCode == '13') {
          // if(!!mInfoUser) {
              // right arrow
              e.preventDefault(); //Prevent default browser behavior mentionsRef.current.toHtml()
              
              
              var stringValue = editorState.getCurrentContent().getPlainText();
              var stringHtml = convertToHTML(editorState.getCurrentContent());
              let id_reply_comment = 0;
              var data = {content: stringValue}
              data.reply_id = reply_id ?? "";
              if(stringValue.length > 0) {

                  handleComment(data);
              }
              setImage('');
              setTimeout(() => {
                  setEditorState(EditorState.createEmpty());
              }, 100);
         
      }
  }
    return (
    <>
        <div className='input-comment'>
          <div className='avatar-input-comment'>
          <img src='https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-Facebook.jpg?resize=560%2C560&ssl=1' width={50} className="avatar-user-comment" />

          </div>

          <div className='div-input'>
            <div className='form-control'>
            <Editor
              editorKey={'editor'}
              editorState={editorState}
              onChange={setEditorState}
              keyBindingFn={checkKey}
              plugins={allPlugins}
              ref={ref}
              placeholder={'Viết bình luận...'}
            />
            </div>
            <div className='emotion-icon'>
              <EmojiSelect />
            </div>
            <div>
            
              <button className='input-image'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </button>
            </div>
            <button className='button-submit'>Bình luận</button>  
          </div>      
        </div>  
       
          
    </>
    )
}


export default InputComment;
