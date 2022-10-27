import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

let s3 = null;
const initializeS3FS = () => {
    const s3Options = {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        signatureVersion: 'v4'
    }

    try {
        s3 = new AWS.S3(s3Options);
        console.log("S3 bucket initialized successfully");
    } catch (error) {
        console.log("Error in initializing S3 bucket - " + error);
    }
}

const uploadFile = (filePath, folderPath) => {
    var uploadParams = { Bucket: process.env.S3_BUCKET_NAME };
    var fileStream = fs.createReadStream(filePath);
    fileStream.on('error', function (err) {
        throw err
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = (folderPath ? folderPath + "/" + path.basename(filePath).substring(1) : path.basename(filePath).substring(1));
    // call S3 to retrieve upload file to specified bucket
    return new Promise((resolve, reject) => {
        s3.upload(uploadParams, (err, data) => {
            if (err) {
                reject(err)
            } else if (data) {
                fs.unlinkSync(filePath, (err) => {
                    if (err) reject(err);
                })
                resolve(data.Key);
            }
        });
    })
}

const deleteFile = (filePath) => {
    const deleteParams = { Bucket: process.env.S3_BUCKET_NAME, Key: filePath }
    return new Promise((resolve, reject) => {
        s3.deleteObject(deleteParams, (err, data) => {
            if (err) {
                reject(err)
            } else if (data) {
                resolve()
            }
        })
    })
}

const readFile = (filePath) => {
    // filePath = 'profile-image/666361951525-image-632909038.jpg';
    const params = { Bucket: process.env.S3_BUCKET_NAME, Key: filePath }
    return new Promise((resolve, reject) => {
        s3.getObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                console.log("Successfully dowloaded data from  bucket");
                resolve(data);
            }
        });
    })
}

export {
    initializeS3FS,
    uploadFile,
    deleteFile,
    readFile
}