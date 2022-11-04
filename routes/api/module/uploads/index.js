const {
	uploadImage,
	uploadFileDocument,
	uploadMultipleImage
} = require('../../../../controller/ImageController');
const uploadFile = require('../../../../utils/multer');

const routerImage = require('express').Router();

routerImage.post('/image', uploadFile.single('image'), uploadImage);
routerImage.post('/file', uploadFile.single('file'), uploadFileDocument);
routerImage.post('/image-multiple', uploadFile.array('images'), uploadMultipleImage);

module.exports = routerImage;
