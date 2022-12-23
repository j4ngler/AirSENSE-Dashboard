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
// import { commentTagUser } from '../../reducers/commentReducer';
// import { loginUser } from '../../api/authen';
// import { registerInfoCustomer } from '../../api/httpBaseUtil.js';
// import {
//     Button
//   } from '@material-ui/core';
// import { uploadfileDataImage,uploadImageDataRegisterInfo } from '../../api/httpBaseUtil.js';
// import SatelliteIcon from '@material-ui/icons/Satellite';
// import ImageIcon from '@material-ui/icons/Image';
// import { uploadImgComment } from '../../reducers/commentReducer.js';
// import withReactContent from 'sweetalert2-react-content';
// import RegisterUser from './RegisterUser.js';


// const MySwal = withReactContent(Swal);
var listUserData = null;

// // emotion
const emojiPlugin = createEmojiPlugin();
const { EmojiSelect } = emojiPlugin;


const InputComment = ({handleComment, infoReply}) => {
  const ref = useRef(null);
  const [editorState, setEditorState] = useState(createEditorStateWithText(''));
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  // // const listUserComment_gs = useSelector(state => state.commentReducer.list_user);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [image, setImage] = useState('');

//   const uploadImageData= async (event)=>{
//       console.log("Content: " + event);
//       event.preventDefault();
//       const data = new FormData() 
//       data.append('file', event.target.files[0]);  
//       console.log(data);  
//       var value = await uploadImageDataRegisterInfo(data);
//       setState({ link:value});
//       dispatch(uploadImgComment(value));
//   }
  



  // const dispatch = useDispatch();
  // suggestion
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

    // useEffect(() => {
    //   setUser(localStorage.getItem('username'));
    //   let listUserComment = JSON.parse(JSON.stringify(listUserComment_gs));
    //   listUserData = listUserComment;
     
    // },[listUserComment_gs])

    const onOpenChange = useCallback((_open) => { setOpen(_open); }, []);
    const onSearchChange = useCallback(({ value }) => {
      setSuggestions(defaultSuggestionsFilter(value, listUserData));
    }, []);

    const checkKey=(e)=> {
        e = e || window.event;
        var mInfoUser = localStorage.getItem('customer');
        setUser(mInfoUser);
        if (e.keyCode == '13') {
            if(!!mInfoUser) {
                // right arrow
                e.preventDefault(); //Prevent default browser behavior mentionsRef.current.toHtml()
                //convertToHTML(this.state.editorState.getCurrentContent()
                console.log("...listUser ",ref);
                console.log("...listUser ",editorState.getCurrentContent().getPlainText());
                // ref.current.editor.editor.innerHTML
                
                var stringValue = editorState.getCurrentContent().getPlainText();
                var stringHtml = convertToHTML(editorState.getCurrentContent());
                let id_reply_comment = 0;
                if(infoReply) {
                    console.log('comment reply', infoReply)
                    
                    if(infoReply.content.id_comment_reply>0)
                        id_reply_comment = infoReply.content.id_comment_reply;
                    else id_reply_comment = infoReply.comment_id;
                }
                if(stringValue.length > 0) {
                    handleComment({stringValue, id_reply_comment,url:image});
                }
                let contentState = editorState.getCurrentContent();
                setImage('');
                setTimeout(() => {
                    setEditorState(EditorState.createEmpty());
                }, 100);
            }
            else
            {
                handleComment();
            }
        }
    }

    // const submitCommentAgain = () => {
    //     if(user!=null&&user.length>2) {
    //           console.log("...listUser ",ref);
    //           console.log("...listUser ",editorState.getCurrentContent().getPlainText());
    //           // ref.current.editor.editor.innerHTML
    //           var stringValue = editorState.getCurrentContent().getPlainText();
    //           var stringHtml = convertToHTML(editorState.getCurrentContent());
    //           let id_reply_comment = 0;
    //           if(infoReply) {
    //             console.log('comment reply', infoReply)
    //             if(infoReply.content.id_comment_reply>0)
    //                 id_reply_comment = infoReply.content.id_comment_reply;
    //             else id_reply_comment = infoReply.comment_id;
    //           }
    //           if(stringValue.length > 0) {
    //               submitData({stringValue, id_reply_comment,url:state.link});
    //           }
    //           setState({ link:''});
    //           setTimeout(() => {
    //             setEditorState(EditorState.createEmpty());
    //           }, 100);
    //     }
    // }
    

    // const getDataInval=(event)=>{
    //   if (event)  submitCommentAgain();
    //   Swal.close();
    //   setInfoUser(localStorage.getItem('customer'));
    // }
    // const oncloseInfo=(event)=>{
    //   Swal.close();
    // }

    // const  checkLoginAndRegister   = async ()  =>   {
    //     try  {
    //           var  result = await  Swal.fire({
    //                             title: 'Bạn không có tài khoản ',
    //                             text: "Xin vui lòng đăng nhập hoặc đăng ký để bình luận",
    //                             icon: 'warning',
    //                             showCancelButton: true,
    //                             confirmButtonText: 'Đăng ký!',
    //                             cancelButtonText: 'Đăng nhập!',
    //                             reverseButtons: true
    //                           });
    //           if (result.isConfirmed) {
    //               await MySwal.fire({
    //                                 title:  <RegisterUser summitData={(e)=>getDataInval(e)} onclose={(e)=>oncloseInfo()}  />,
    //                                 showCancelButton: false, showConfirmButton: false, didOpen: () => { },
    //                               });
    //           }
    //           else
    //           {
    //               if(result.dismiss=='cancel'){
    //                   const { value: formValues } = await Swal.fire({
    //                                               title: 'Đăng nhập',
    //                                               html:
    //                                                 `<div class="login-table-container">
    //                                                 <input type="text" class="login-table-input" id='swal-input1' placeholder="Email">
    //                                                 <input type="password" class="login-table-input" id='swal-input2' placeholder="Password">
    //                                                 `,
    //                                               focusConfirm: false,
    //                                               confirmButtonText: 'Đăng nhập',
    //                                               preConfirm: () => {
    //                                                 return { username: document.getElementById('swal-input1').value,
    //                                                           password: document.getElementById('swal-input2').value };
    //                                               }
    //                                             });
    //                   if (formValues) {
    //                       var resData = await  loginUser(formValues);
    //                       console.log("resData",resData);
    //                       if(resData.status==200){
    //                           localStorage.setItem('customer', resData.data.email);
    //                           localStorage.setItem('token', resData.data.token);
    //                           localStorage.setItem('avatar', resData.data.avatar);
                              
    //                           setInfoUser(localStorage.getItem('customer'));
    //                           setUserAvatar(resData.data.avatar);
    //                           submitCommentAgain();
    //                       }
                          
    //                   }
    //               } 
    //           }      
    //     }
    //     catch(error){
    //       Swal.showValidationMessage(
    //         `Request failed: ${error}`
    //       );
    //     }
    // }

    // const submitComment = async () =>  {
    //     var mInfoUser = localStorage.getItem('customer');
    //     setUser(mInfoUser);
    //     if(!!mInfoUser) {
    //       console.log("...listUser ",ref);
    //       console.log("...listUser ",editorState.getCurrentContent().getPlainText());
    //       // ref.current.editor.editor.innerHTML
          
    //       var stringValue = editorState.getCurrentContent().getPlainText();
    //       var stringHtml = convertToHTML(editorState.getCurrentContent());
    //       let id_reply_comment = 0;
    //       if(infoReply) {
    //         console.log('comment reply', infoReply)
    //         id_reply_comment = infoReply.comment_id;
    //         if(infoReply.content.id_comment_reply>0)
    //             id_reply_comment = infoReply.content.id_comment_reply;
    //         else id_reply_comment = infoReply.comment_id;
    //       }
    //       if(stringValue.length > 0) {
    //           submitData({stringValue, id_reply_comment,url:state.link});
    //       }
    //       setState({ link:''});
    //       setTimeout(() => {
    //         setEditorState(EditorState.createEmpty());
    //       }, 100);
    //     }
    //     else {
    //       await checkLoginAndRegister();
    //     }     
    // }

      // const subDataComment = useSelector(state => state.commentReducer.sub_data_comment);
      // const linkImgUpload = subDataComment.link_img;

      // console.log("infoReply.....................????????????????.............",infoReply);

    return (
    <>
        <div className='input-comment'>
        <p>test mnp</p>
        <img src={avatar} width={50} className="avatar-user-comment" />
        <div className='form-control'>
        <Editor
        editorKey={'editor'}
        editorState={editorState}
        onChange={setEditorState}
        keyBindingFn={checkKey}
        plugins={allPlugins}
        ref={ref}
        placeholder={'Hãy viết gì đó'}
      />
      </div>
      {/* <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={(user) => {
          dispatch(commentTagUser(user));
        }}
      /> */}
      <div className='emotion-icon'>
      <EmojiSelect />
      </div>
      {/* <div className='upload-imgage-block'>
            <Button variant="outlined" component="label" disableElevation style={{width:20,height: 30, borderRadius: 20}}>
                <SatelliteIcon />
                <input type="file" 
                        name="fileUpload1"
                        id="fileUpload1"
                        accept=".png,.jpg,.jpeg"
                        onChange={(event)=> {uploadImageData(event)}}
                        hidden />
            </Button>
            
            </div>
            <button className='comment-submit-btn' onClick={() => submitComment()}>Bình luận</button>
       
       </div> */}
        <div className={!!image?'image-comment':'no-display-image'}>
        <img src={image} className='picture-upload-comment' width="200px" height="200px" />
        </div>   
        </div>     
        </>
    )
}


export default InputComment;
