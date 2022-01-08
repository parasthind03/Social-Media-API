const router = require('express').Router();
const { protect } = require('../controllers/authController');
const postController = require('../controllers/postController');

//Get a Post
router.get('/:id', postController.getPost);

router.use(protect);
//Create Post
router.post('/', postController.create);

//Update a Post
router.patch('/:id', postController.updatePost);

//Delete a Post
router.delete('/:id', postController.deletePost);

//Like/Dislike a Post
router.patch('/:id/like', postController.toggleLike);

module.exports = router;
