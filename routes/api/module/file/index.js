const FileController = require('../../../../controller/FileController');

const router = require('express').Router();

router.post('/delete', FileController.reqDeleteFile);

module.exports = router;
