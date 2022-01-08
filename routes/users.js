const router = require('express').Router();
const User = require('../models/user');
const { protect } = require('../controllers/authController');
const userController = require('../controllers/userController');

//update User
router.use(protect);
router.patch('/:id', userController.updateUser);

//Delete user
router.delete('/', userController.deleteUser);

//get a user
router.get('/:id', userController.getUser);

//follow a user
router.patch('/:id/follow', userController.follow);

//unfollow a user
router.patch('/:id/unfollow', userController.unfollow);

module.exports = router;
