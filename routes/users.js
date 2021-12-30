const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { protect } = require('../controllers/authController');

//update User
router.put('/:id', protect, async (req, res, next) => {
	try {
		if (req.user._id === req.params.id) {
			if (req.body.password) {
				const salt = await bcrypt.genSalt(12);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			}

			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body
			});
			res.status(200).json({
				status: 'success',
				message: 'Your account has been updated!'
			});
		} else {
			throw new Error('You can update only your account');
		}
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
});

//Delete user
router.delete('/', protect, async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.user._id);
		res.status(200).json({
			status: 'success',
			message: 'Your account has been deleted!'
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
});

//get a user
router.get('/:id', protect, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('There is no user with this id');
		}
		// console.log(user._doc);
		const { password, updatedAt, __v, ...others } = user._doc;
		res.status(200).json({
			status: 'success',
			data: others
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
});

//follow a user
router.put('/:id/follow', protect, async (req, res, next) => {
	try {
		if (req.user._id !== req.params.id) {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.user._id);

			if (!user.followers.includes(req.user._id)) {
				await user.updateOne({ $push: { followers: req.user._id } });
				await currentUser.updateOne({ $push: { following: req.params.id } });

				res.status(200).json({
					status: 'success',
					message: 'You have followed the user!'
				});
			} else {
				throw new Error('You already follow this user');
			}
		} else {
			throw new Error('You cannot follow yourself!');
		}
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
});

//unfollow a user
router.put('/:id/unfollow', protect, async (req, res, next) => {
	try {
		if (req.user._id !== req.params.id) {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.user._id);

			if (user.followers.includes(req.user._id)) {
				await user.updateOne({ $pull: { followers: req.user._id } });
				await currentUser.updateOne({ $pull: { following: req.params.id } });

				res.status(200).json({
					status: 'success',
					message: 'You have unfollowed the user!'
				});
			} else {
				throw new Error('You have already unfollowed this user');
			}
		} else {
			throw new Error('You cannot unfollow yourself!');
		}
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
});

module.exports = router;
