import React from 'react'
import { useEffect } from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useCallback } from 'react';

import { httpGetData } from '../../features/API/httpBaseUtils';
import { MyCustomUploadAdapterPlugin } from '../../features/API/uploadAdapter';
import { useState } from 'react';
import { API_URL } from '../../configs/config';
const DocumentForm = ({ idBlog, form }) => {
    const [contentHtml, setContentHtml] = useState("")
    const fetchContent = useCallback(async () => {
        const data = await httpGetData(API_URL + `customers/get-content-blog/${idBlog.split('/')[1]}`)
        form.setFieldsValue({ "content_html": data.data.data })
        setContentHtml(data.data.data)
    }, [form,idBlog])
    const custom_config = {
        extraPlugins: [MyCustomUploadAdapterPlugin],
    };
    useEffect(() => {
        fetchContent()
    }, [fetchContent])
    return (
        <div className={"document-editor"}>
            <div id="toolbar-container"></div>
            <CKEditor
                editor={ClassicEditor}
                data={contentHtml}
                config={custom_config}
                onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContentHtml(data);
                    console.log(typeof data)
                    form.setFieldsValue({ "content_html": data })
                }}
                onBlur={(event, editor) => {

                }}
                onFocus={(event, editor) => {

                }}
            />
        </div>
    )
}

export default DocumentForm
