const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: [true, 'Please provide a name']
		},
		email: {
			type: String,
			unique: true,
			match: [
				/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
				'Please enter a valid email address'
			],
			required: [true, 'Please provide an email']
		},
		password: {
			type: String,
			minlength: 8,
			required: [true, 'Please provide a password']
		},
		//Optional
		passwordConfirm: {
			type: String,
			validate: {
				// This only works on CREATE and SAVE!!!
				validator: function (el) {
					return el === this.password;
				},
				message: 'Passwords are not the same!'
			}
		},
		profilePicture: {
			type: String,
			default: ''
		},
		coverPicture: {
			type: String,
			default: ''
		},
		followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
		following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
		isAdmin: {
			type: Boolean,
			default: false
		},
		description: {
			type: String,
			max: 50
		},
		city: {
			type: String,
			max: 50
		},
		from: {
			type: String,
			max: 50
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('User', userSchema);
