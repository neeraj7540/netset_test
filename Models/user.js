const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		number: {
			type: String,
			trim: true
		},
		file: {
			type: String
		}
	},
	{ minimize: false },
);
const User = mongoose.model('User', UserSchema);
module.exports = User;



