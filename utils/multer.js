const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../public/uploads'));
	},
	filename: function (req, file, cb) {
		cb(null, `uploads-${Date.now()}.${file.mimetype.split('/')[1]}`);
	}
});

// const excelFilter = (req, file, cb) => {
//   if (
//     file.mimetype.includes("excel") ||
//     file.mimetype.includes("spreadsheetml")
//   ) {
//     cb(null, true);
//   } else {
//     cb("Please upload only file excel", false);
//   }
// };

const filter = (req, file, cb) => {
	if (file.mimetype.includes('image')) {
		return cb(null, true);
	}

	cb('Please upload only image', false);
};

const uploadFile = multer({ storage: storage, limits: { fileSize: 1000000 } });
module.exports = uploadFile;
