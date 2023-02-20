import "./News.css";
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select, Input, Modal, Upload, Col, Row } from "antd";
import { FormOutlined} from "@ant-design/icons";
import ButtonComponent from "../../../components/Button";
import { PlusOutlined } from "@ant-design/icons";
import { httpGetDataTable } from "../../../features/API/httpBaseUtils";
import { API_URL } from "../../../configs/config";
import { httpPostData, uploadFileDataImage } from "../../../features/API/httpBaseUtils";



// init newspaperData type 
export default function News() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const [content,setContent] = useState('')
  const [contentSubListAll,setContentSubListAll] = useState([])
  const [contentGroupList, setContentGroupList] = useState([])
  const [contentSubList,setContentSubList] = useState([])
  const [descriptionDetail,setDescriptionDetail] = useState('')
  const [title,setTitle] = useState('')
  const [contentGroup,setContentGroup] = useState('')
  const [contentSub,setContentSub] = useState('')
  const [dataNewspaper,setDataNewSpaper] = useState ({
      // img:'',
      contentNewSpaper:'',
      title: '',
      descriptionDetail: '',
      contentGroup:'',
      contentSub:'',
  })
   async function fetchDataTable (tableName, setData) {
    const data = await httpGetDataTable(tableName)
    console.log(data);
    setData(data);
  }
  useEffect(()=>{
    fetchDataTable('content_group', setContentGroupList);
    fetchDataTable('content_sub', setContentSubListAll)
  },[])

  const handleChange = (event) => {
    console.log("Content: " + event);
    // event.preventDefault();
    let data = new FormData() 
    data.append('file', event);   
    uploadFileDataImage(data).then((response)=>{
        var value = response.data.url;
        console.log("uploadfileDataImage.....................",response,response.data.path,value);
        // Swal.fire("Cập nhật thông tin thành công");
        // setState({ link:value});
        // uploadfileDataLink(value);
    });
}
    // setFileList(newFileList);

  

 function onClickSubmit ()  {
    setDataNewSpaper({
      contentNewSpaper: content,
      title: title,
      descriptionDetail: descriptionDetail,
      contentGroup: contentGroup,
      contentSub: contentSub,
    })
    
    httpPostData(API_URL + 'document/uploadFile', 'testimg')
    // httpPostData(API_URL + 'customer/import-data', dataNewspaper)

  }

    const handleChange = ({ fileList: newFileList }) =>
  
  {
    console.log('Heloo guang....')
    setFileList(newFileList);

  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const onChange = (value) => {
    console.log(value);
  };

  return (
    <Col span={22} offset={1} className="news-container">
      <div className="title">
        <h1>Đăng bài viết</h1>
      </div>
      <Row>
        <Col span={10} offset={1}>
          <div>Ảnh bài báo</div>
          <Upload
            // action="http://localhost:3006/customer"
            listType="picture-card"
            // fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={file=>{
              console.log({file})
              return false
            }}
          >
            {fileList.length >= 1 ? null : (<div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>)}
          </Upload>

          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </Col>
      </Row>
      <Row>
        <Col span={10} offset={1}>
          <p>Chuyên mục (menu)</p>
          <Select
            size="large"
            placeholder="Please select"
            onChange={(value,option) => {
              const datas = contentSubListAll.filter(e => e.content_group_id == option.value)
              console.log('sub content', datas)
              setContentSubList(datas)
              setContentGroup(value)
            }}
            style={{
              width: "100%",
            }}
          >
            {
              contentGroupList.map((group)=>(
                <Select.Option value={group.content_group_id}>
                {group.content}                        
              </Select.Option>
              ))
            }
            </Select>
        </Col>
        <Col span={10} offset={2}>
          <p>Chuyên mục chi tiết</p>
          <Select
            size="large"
            placeholder="Please select"
             onChange={(value,option)=>{
              setContentSub(value)
             }}
            style={{
              width: "100%",
            }}
          >
           {
            contentSubList.map((sub) => (
              <Select.Option value={sub.content_sub_id}>
                {sub.content}                        
              </Select.Option>
            ))
           }
          </Select>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={10} offset={1}>
          <p>Tiêu đề bài viết</p>
          <Input
            size="large"
            placeholder="large size"
            prefix={<FormOutlined />}
            onChange={(e)=> {
              setTitle(e.target.value)
              }}
          />
        </Col>

        <Col span={10} offset={2}>
          <p>Mô tả cụ thể</p>
          <Input
            size="large"
            placeholder="large size"
            prefix={<FormOutlined />}
            onChange={(e)=> {
            setDescriptionDetail(e.target.value)
            }}
            
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={22} offset={1}>
          <h2>Nội dung bài viết</h2>
          <div className={"document-editor"}>
            <div id="toolbar-container"></div>
            <CKEditor
              editor={ClassicEditor}
              data=""
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);               
              }}
            />
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col offset={1}>
          <ButtonComponent content={'Đăng bài'} handle= {onClickSubmit}/>
        </Col>
      </Row>
    </Col>
  );
}
