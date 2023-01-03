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
// import { useDispatch } from 'react-redux';
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
        let mInfoUser = localStorage.getItem('token_AirSENSE');
        setUser(mInfoUser);
        if (e.keyCode == '13') {
            // if(!!mInfoUser) {
                // right arrow
                e.preventDefault(); //Prevent default browser behavior mentionsRef.current.toHtml()
                //convertToHTML(this.state.editorState.getCurrentContent()
                // console.log("...listUser ",ref);
                // console.log("...listUser ",editorState.getCurrentContent().getPlainText());
                // ref.current.editor.editor.innerHTML
                
                var stringValue = editorState.getCurrentContent().getPlainText();
                var stringHtml = convertToHTML(editorState.getCurrentContent());
                let id_reply_comment = 0;
                // if(infoReply) {
                //     console.log('comment reply', infoReply)
                    
                //     if(infoReply.content.id_comment_reply>0)
                //         id_reply_comment = infoReply.content.id_comment_reply;
                //     else id_reply_comment = infoReply.comment_id;
                // }
                if(stringValue.length > 0) {
                    handleComment({stringValue, id_reply_comment,url:image});
                }
                let contentState = editorState.getCurrentContent();
                setImage('');
                setTimeout(() => {
                    setEditorState(EditorState.createEmpty());
                }, 100);
            // }
            // else
            // {
            //     handleComment({kn: 'no data'});
            // }
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
          <p>Comments</p>
          <img src={avatar} width={50} className="avatar-user-comment" />
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
          <p>0 Comments</p>
          
      {/* <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={(user) => {
          dispatch(commentTagUser(user));
        }}
      /> */}
      
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
        
        </div>  
        <div>
          <div className='update'>
            <button className='popular'>Popular</button>
            <button className='newest'>Newest</button>
          </div>
          <div className='box-inf-comment'>
            <div className='comment'>
              <div className=''>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 img-user-comment">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className='inf-comment'>
                <h4 className='username'>Olivia Gribben</h4>
                <div className='describe-comment'>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, accusantium consequatur. Perspiciatis!</p>
                  <p>
                    Lorem ipsum dolor sit, amet
                    <span>
                      ...
                      <button className='read-more'>Read more</button>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className='emotion-comment'>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 heart">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </span>
                  <span>5</span>
                  <span className='dots'>.</span>
                  <span><a className='reply'>Reply</a></span>
                  <span className='dots'>.</span>
                  <span className=''>1h</span>
                  
            </div>
          </div>
          <div className='box-inf-comment'>
            <div className='comment'>
              <div className=''>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 img-user-comment">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className='inf-comment'>
                <h4 className='username'>Olivia Gribben</h4>
                <div className='describe-comment'>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, accusantium consequatur. Perspiciatis!</p>
                  <p>
                    Lorem ipsum dolor sit, amet
                    <span>
                      ...
                      <button className='read-more'>Read more</button>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className='emotion-comment'>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 heart">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </span>
                  <span>5</span>
                  <span className='dots'>.</span>
                  <span><a className='reply'>Reply</a></span>
                  <span className='dots'>.</span>
                  <span className=''>1h</span>
            </div>
            <br></br>
            <button className='view-more'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 margin-top-2px">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              <span className='padding-l-r-8px'>View 2 replies</span>
            </button>
          </div>    
        </div> 
          
    </>
    )
}


export default InputComment;
