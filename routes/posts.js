const router = require('express').Router();
const Post = require('../models/post');
const { protect } = require('../controllers/authController');

//Create Post
router.post('/', protect, async (req, res, next) => {
	try {
    req.body.userId = req.user.id
		const newPost = new Post(req.body);
		const savedPost = await newPost.save();
		res.status(200).json({
			status: 'success',
			post: savedPost
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			msg: e.message
		});
	}
});

//Update a Post
router.put('/:id', protect, async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.user._id) {
			await post.updateOne({ $set: req.body });
			res.status(200).json({
				status: 'success',
				message: 'The post has been updated'
			});
		} else {
			throw new Error('You cannot update other users posts');
		}
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			msg: e.message
		});
	}
});

//Delete a Post
router.delete('/:id', protect, async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.user._id) {
			await post.deleteOne();
			res.status(200).json({
				status: 'success',
				message: 'The post has been deleted'
			});
		} else {
			throw new Error('You cannot delete other users posts');
		}
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			msg: e.message
		});
	}
});

//Like/Dislike a Post
router.put('/:id/like', protect, async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			throw new Error('The user has deleted this post');
		}
		if (!post.likes.includes(req.user._id)) {
			await post.updateOne({ $push: { likes: req.user._id } });
			res.status(200).json({
				status: 'success',
				message: 'You have liked the post'
			});
		} else {
			await post.updateOne({ $pull: { likes: req.user._id } });
			res.status(200).json({
				status: 'success',
				message: 'You have disliked the post'
			});
		}
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			msg: e.message
		});
	}
});

//Get a Post
router.get('/:id', async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			throw new Error('The post is no longer available!');
		} else {
			res.status(200).json({
				status: 'success',
				post
			});
		}
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			msg: e.message
		});
	}
});

module.exports = router;
