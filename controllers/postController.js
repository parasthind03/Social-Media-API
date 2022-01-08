const Post = require('../models/post');

exports.create = async (req, res, next) => {
	try {
		req.body.userId = req.user.id;
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
};

exports.updatePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.user.id) {
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
};

exports.deletePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.user.id) {
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
};

exports.toggleLike = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			throw new Error('The user has deleted this post');
		}
		if (!post.likes.includes(req.user.id)) {
			await post.updateOne({ $push: { likes: req.user.id } });
			res.status(200).json({
				status: 'success',
				message: 'You have liked the post'
			});
		} else {
			await post.updateOne({ $pull: { likes: req.user.id } });
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
};

exports.getPost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate({path: 'likes', select: 'username email profilePicture'});
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
};
