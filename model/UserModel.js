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
		trim: true,
		default: ''
	},
	phone_number: {
		type: String,
		trim: true,
		default: ''
	},
	root_user: {
		type: Boolean,
		default: false
	},
	gender: {
		type: String,
		trim: true,
		enum: ['male', 'female'],
		default: 'male'
	},
	email_notification: {
		type: String,
		trim: true,
		default: process.env.ADMIN_EMAIL || 'thangld2407@gmail.com'
	}
});

module.exports = mongoose.model('User', UserSchema);
