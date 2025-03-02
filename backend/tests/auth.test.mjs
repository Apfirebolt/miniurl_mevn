import { request } from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../server';
const User = mongoose.model('User');

let jwtSecret = 'abc123';
let mongoUri = 'mongodb://localhost:27017/mevn_url_shortener_test';

describe('auth endpoints', () => {
  let user;

  beforeEach(async () => {
    // connect app to test database
    user = {
      username: 'user',
      email: 'example@gmail.com',
      password: 'password'
    };
    await User.create(user);
  });

  describe('/login', () => {

    test('returns a valid auth token', done => {
      request(app)
        .post('/api/users/auth')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(res => {
          const { token } = res.body;
          const payload = jwt.verify(token, jwtSecret);
          expect(payload.user.username).toEqual(user.username);
        })
        .expect(200, done);
    });
  });

  describe('/register', () => {

    test('creates a new user and returns a valid auth token', done => {
      request(app)
        .post('/api/users')
        .send({ ...user })
        .expect('Content-Type', /json/)
        .expect(res => {
          const { token } = res.body;
          const payload = jwt.verify(token, config.jwt.secret);
          expect(payload.user.username).toEqual(username.nonExisting);
        })
        .expect(201, done);
    });
  });
});
