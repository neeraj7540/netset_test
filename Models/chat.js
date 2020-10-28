const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema(
	{
		chatDetail: [
			{
				message: {
					type: String,
			        trim: true
				},
				userId: {
					type: String,
					trim: true
				},
			}
		],
	},
	{ minimize: false },
);
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
