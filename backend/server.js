import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
dotenv.config();
import connectDB from './config/db.js';
import redisClient from './config/redisDb.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
// import connectAndShowUsers from './data/showUsers.js';

const port = process.env.PORT || 5000;

connectDB();
redisClient();

const app = express();
// const redis = redisClient();
// redis.connect();

// redis.set('mongo_redis', 'A value set by redis from Express', (err, reply) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(reply);
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/urls', urlRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// cron.schedule('* * * * *', () => {
//   console.log('Running a task every minute');
//   // This would connect to MongoDb and show all users every minute
//   // connectAndShowUsers();
// });

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
