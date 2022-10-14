import multer from 'multer'

const generateFileName = (req, file) => {
    const nameSplit = file.originalname.split('.')
    const extension = nameSplit.length > 1 ? nameSplit[nameSplit.length - 1] : 'txt';
    const fieldName = file.fieldname && file.fieldname != "file" && file.fieldname != "files" ? file.fieldname + '-' : '';
    return Date.now() + '-' + fieldName + Math.round(Math.random() * 1E9) + "." + extension;
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'tmp')
    },
    filename: function (req, file, callback) {
        const uniqueName = generateFileName(req, file)
        callback(null, uniqueName)
    }
});

const upload = multer({ storage: storage });
export default upload;