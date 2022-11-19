const {
	uploadImage,
	uploadFileDocument,
	uploadMultipleImage
} = require('../../../../controller/ImageController');
const uploadFile = require('../../../../utils/multer');
const requireLogin = require('../../../../middleware/requireLogin');

const routerImage = require('express').Router();

routerImage.post('/image', requireLogin, uploadFile.single('image'), uploadImage);
routerImage.post('/file', requireLogin, uploadFile.single('file'), uploadFileDocument);
routerImage.post('/image-multiple', requireLogin, uploadFile.array('images'), uploadMultipleImage);

module.exports = routerImage;
