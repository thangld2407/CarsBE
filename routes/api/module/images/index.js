const { uploadImage } = require('../../../../controller/ImageController');
const uploadFile = require('../../../../utils/multer');

const routerImage = require('express').Router();

routerImage.post('/upload', uploadFile.single('image'), uploadImage);

module.exports = routerImage;