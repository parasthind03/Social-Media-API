const router = require('express').Router();
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Post = require('../models/postModel');

//Create Post
router.post('/', catchAsync(async (req, res, next) => {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json({
      status: 'success',
      post: savedPost
    });
  })
);

//Update a Post
router.put('/:id', catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({
        status: 'success',
        message: 'The post has been updated'
      });
    } else {
      return next(new AppError('You cannot update other users posts', 403));
    }
  })
);

//Delete a Post
router.delete('/:id', catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({
        status: 'success',
        message: 'The post has been deleted'
      });
    } else {
      return next(new AppError('You cannot delete other users posts', 403));
    }
  })
);

//Like/Dislike a Post
router.put('/:id/like', catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(!post){
      return next(new AppError('The user has deleted this post', 400));
    }
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({$push: {likes: req.body.userId}})
      res.status(200).json({
        status: 'success',
        message: 'You have liked the post'
      })
    } else{
      await post.updateOne({$pull: {likes: req.body.userId}})
      res.status(200).json({
        status: 'success',
        message: 'You have disliked the post'
      })
    }
  })
);

//Get a Post
router.get('/:id', catchAsync( async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(!post){
      return next(new AppError('The post is no longer available!', 400));
    } else{
      res.status(200).json({
        status: 'success',
        post
      })
    }
  })
);

//Get timeline followings posts
router.get('/timeline/all', catchAsync( async (req, res, next) => {
    let postArray = [];
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.following.map(friendId => Post.find({userId: friendId}))
    )
    res.status(200).json({
      status: 'success',
      posts: userPosts.concat(friendPosts)
    })
  })
);

module.exports = router;
