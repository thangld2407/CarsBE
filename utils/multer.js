const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let filename = '';
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../public/uploads'));
	},
	filename: function (req, file, cb) {
		if (file.mimetype.includes('image')) {
			filename = `uploads-${Date.now()}-${uuidv4()}.webp`;
		} else {
			filename = `uploads-${Date.now()}-${uuidv4()}.${file.mimetype.split('/')[1]}`;
		}
		cb(null, filename);
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

const uploadFile = multer({
	storage: storage
});
module.exports = uploadFile;
