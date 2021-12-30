require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

const app = express();

connectDB();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

if (process.env.ENV === 'development') {
	app.use(morgan('dev'));
}

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postsRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
