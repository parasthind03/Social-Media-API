const router = require('express').Router();
const User = require('./../models/userModel');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const issueJWT = (req, res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 2 * 24 * 60 * 60 * 1000
  });
  // console.log(token);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 *1000
    )
  });
  return token;
};

//REGISTER
router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    //encrypting the password
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    //create new User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass
    });
    //saving user to db and returning response
    const user = await newUser.save();
    issueJWT(req, res, user);
    res.status(200).json({ user, token });
  })
);

router.post(
  '/login',
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with this email!', 400));
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return next(new AppError('Incorrect Email or password!', 401));
    }
    const token = issueJWT(req, res, user);
    res.status(200).json({ user, token });
  })
);


module.exports = router;
