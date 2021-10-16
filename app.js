const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/usersRoutes');
const authRouter = require('./routes/authRoutes');
const postsRouter = require('./routes/postsRoutes');
const errorHandler = require('./controllers/errorController');

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
  console.log('Database connected');
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postsRouter);

app.use(errorHandler);

app.listen(4000, () => {
  console.log('Backend Server running...');
});
