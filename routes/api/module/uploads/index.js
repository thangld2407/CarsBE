const { uploadImage, uploadFileDocument } = require('../../../../controller/ImageController');
const uploadFile = require('../../../../utils/multer');

const routerImage = require('express').Router();

routerImage.post('/image', uploadFile.single('image'), uploadImage);
routerImage.post('/file', uploadFile.single('file'), uploadFileDocument);

module.exports = routerImage;
