const router = require('express').Router();
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const protect = require('./../middleware/protect');

//update User
router.put(
  '/:id',
  protect,
  catchAsync(async (req, res, next) => {
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
      return next(new AppError('You can update only your account', 401));
    }
  })
);

//Delete user
router.delete(
  '/',
  protect,
  catchAsync(async (req, res, next) => {
      const user = await User.findByIdAndDelete(req.user._id);
      res.status(200).json({
        status: 'success',
        message: 'Your account has been deleted!'
      });
  })
);

//get a user
router.get(
  '/:id',
  protect,
  catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('There is no user with this id'));
    }
    // console.log(user._doc);
    const { password, updatedAt, __v, ...others } = user._doc;
    res.status(200).json({
      status: 'success',
      data: others
    });
  })
);

//follow a user
router.put(
  '/:id/follow',
  protect,
  catchAsync(async (req, res, next) => {
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
        return next(new AppError('You already follow this user', 403));
      }
    } else {
      return next(new AppError('You cannot follow yourself!', 403));
    }
  })
);

//unfollow a user
router.put(
  '/:id/unfollow',
  protect,
  catchAsync(async (req, res, next) => {
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
        return next(new AppError('You have already unfollowed this user', 403));
      }
    } else {
      return next(new AppError('You cannot unfollow yourself!', 403));
    }
  })
);

module.exports = router;
