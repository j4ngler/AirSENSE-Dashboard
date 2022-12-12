const AWS = require('aws-sdk');
require('dotenv').config();
const fs = require('fs');
const {getRamdomData} = require("../utils/utilsString");
// Enter copied or downloaded access ID and secret key here
const ID = process.env.ID_S3_INFO;
const SECRET = process.env.SECRET_S3_INFO;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME_S3_INFO;
const FILE_S3_RETURN = process.env.FILE_S3_RETURN;
const LINK_FOLDER_PUBLIC = process.env.LINK_FOLDER_PUBLIC;
const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "ap-southeast-1"
    }
};


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const DEFINE_DOCUMENT={
    TYPE_IMAGE:0,
    TYPE_HTML:1
};

exports.DEFINE_DOCUMENT =DEFINE_DOCUMENT;



exports.uploadFileS3 = async  function (fileDetail,fileName,type_document=DEFINE_DOCUMENT.TYPE_IMAGE){
    // Read content from the file
    try
    {
        console.log("fileDetail",fileDetail,fileName);
        var fileLink= LINK_FOLDER_PUBLIC +fileDetail;
        console.log("fileLink",fileLink);
        const fileContent = fs.readFileSync(fileLink);
        // Setting up S3 upload parameters
        console.log("fileContent ",fileContent);
        var floderImage='/image/';
        var newfile=fileName;
        if(type_document==DEFINE_DOCUMENT.TYPE_HTML){
            floderImage="/html/";
            newfile= 'file'+getRamdomData(20)+ (new Date().getTime())+".html";
        } 
        const params = {
            Bucket: BUCKET_NAME,
            Key: FILE_S3_RETURN+floderImage+newfile, // File name you want to save as in S3
            Body: fileContent
        };
        // Uploading files to the bucket
        var data = await s3.upload(params).promise()
        console.log("params",data);
       // await fs.unlinkSync(fileLink);
        return data.Location;
        /* s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });*/
    }
    catch(ie){
        console.log("ie",ie);
        return null;
    }
    
};

