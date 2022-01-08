const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true
		},
		desc: {
			type: String,
			max: 500
		},
		img: String,
		likes: [
			{
				type: mongoose.Schema.ObjectId,
        ref: 'User'
			}
		]
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Post', postSchema);
