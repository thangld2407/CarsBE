const bcrypt = require('bcryptjs');

module.exports = {
	hashPassword: function (password) {
		return bcrypt.hashSync(password, 10);
	},
	comparePassword: function (password, hash) {
		return bcrypt.compareSync(password, hash);
	}
};
