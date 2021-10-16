const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const protect = catchAsync(async (req, res, next) => {
    let token;
    if(req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in again', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findOne({_id: decoded.id});
    if(!user){
        return next(new AppError('The user no longer exists', 401));
    }

    req.user = user;
    next();
})

module.exports = protect;