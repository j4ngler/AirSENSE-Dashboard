import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Button,
  InputLabel,
  MenuItem,
  Select,
  Input,
  Checkbox,
  TextField,
} from '@material-ui/core';
import ManagerData from '../../actions/ManagerData.js';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

var infoQuestion =[{id:0,info:"Trả lời viết"},{id:1,info:"Trắc nghiệm"}];
var TextIndex =['A','B','C','D','E','F','G','H'];

function convertHTML(lstQuestion,mode,responseText){
    if(mode==1){
        var html=`<div id="check_question_id"><ul class="selct_resspose" id="valueSelect" ><ul>`;
        var response=[];
        if(!!lstQuestion)
        lstQuestion.forEach((item,index) => {
            html =html+`<li> <input type="checkbox"  value="`
                        +item.id+`"/>`
                        +item.id+'. '
                        +item.info+`</li>`;
            if(item.isTrue) response.push(TextIndex[index]);
        });
        html =html+`</ul> </div>`;
        return {mode:1,html:html,response:response.toString()};
    }
    return {mode:0,html:"",response:responseText};
}




const SelectMultipleChoice = ({typeQuestion,question,reply,onChange}) => {
    // const [ handleClose] = useState()
    const [selectQuestion, setSelectQuestion] = useState(0);
    const [lstQuestion, setLstQuestion] = useState([]);
    const [responseQuestion, setResponseQuestion] = useState(reply);
    //useEffect
    useEffect(() => {
        setSelectQuestion(typeQuestion);
        setLstQuestion(question);
        setResponseQuestion(reply);
    },[typeQuestion,question,reply]);

    const onChangeQuestion = (content) => {
        setSelectQuestion(content);
        onChange(convertHTML(lstQuestion,selectQuestion,responseQuestion));
    }
    const editInfoQuestion = (index,name,value) => {
        var prevContent = [...lstQuestion];
        prevContent[index][name] =value;
        setLstQuestion(prevContent);
        onChange(convertHTML(lstQuestion,selectQuestion,responseQuestion));
    }
    const removeInfoQuestion = (index) => {
        var prevContent = [...lstQuestion];
        var counter=0;
        var newContent=[];
        prevContent.forEach((element,number) => {
            if(number!=index){
                element.id =TextIndex[counter];
                newContent.push(element);
                counter= counter+1;
            }
        });
        setLstQuestion(newContent);
        onChange(convertHTML(lstQuestion,selectQuestion,responseQuestion));
    }
    const addInfoQuestion = () => {
        setLstQuestion(lstQuestion.concat({id:TextIndex[lstQuestion.length],info:"thêm câu hỏi",isTrue:false})); 
        console.log("lstQuestion",lstQuestion);
        onChange(convertHTML(lstQuestion,selectQuestion,responseQuestion));
    }

    return (
        <div className={'dp-i'}>
            <FormControl variant="outlined" className={'dp-i__type-answer'}>
                <InputLabel
                    className={'register-label'}
                    shrink
                    id="demo-simple-select-menu"
                    >
                Loại câu trả lời:
                </InputLabel>
                <Select
                    className={'margin-right-register'}
                    labelId="demo-simple-select-menu"
                    id="status"
                    value={selectQuestion}
                    onChange={(event) => {
                        onChangeQuestion(event.target.value);
                    }}
                    >
                    {infoQuestion.map((vars) => (
                        <MenuItem value={vars.id} key={vars.id}>
                        {vars.info}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <br/>
            {selectQuestion==0? <Input name="name_image_detail" value={responseQuestion}
                                    onChange={(e)=>setResponseQuestion(e.target.value)} />:
                <div className={'messages-dm-message'}>
                    {lstQuestion.map((item, index) => (
                        <div className={'title-dm-message'} key={item.id}>
                            <div >
                                    <RemoveCircleOutlineIcon  onClick={() => {removeInfoQuestion(index)}}/>
                                    {item.id+" . "}
                                    <Input name="name_image_detail" value={item.info}
                                        onChange={(e)=>{
                                            editInfoQuestion(index,"info",e.target.value);
                                        }} />
                                    Chọn câu trả lời 
                                    <Checkbox checked={item.isTrue}
                                            onChange={(e)=>editInfoQuestion(index,"isTrue",e.target.checked )}/>
                            </div>
                           
                        </div>
                    ))}
                    <div onClick={addInfoQuestion}>
                        <AddCircleOutlineIcon />
                    </div>
                </div>
            }
        </div>
    );
};

export default SelectMultipleChoice;
