const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	name: {
		type: String,
		trim: true,
		default: 'Adminstrator'
	},
	dob: {
		type: String,
		trim: true,
		default: new Date().toLocaleDateString()
	},
	address: {
		type: String,
		trim: true
	},
	phone_number: {
		type: String,
		trim: true
	}
});

module.exports = mongoose.model('User', UserSchema);
