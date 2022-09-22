const request = require('supertest');
const connectDB = require('../config/dbConn');
const app = require('../app');
const mongoose = require('mongoose/index.js');

describe('Good index routes', () => {
  test('responds to /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('responds to /index', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('responds to /index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});

describe('Good dish routes', () => {
  beforeEach(() => {
    connectDB();
  });
  test('responds to /dishes', async () => {
    const res = await request(app).get('/dishes?en=').set({ Accept: 'application/json' });
    console.log(res.body);
    expect(res.statusCode).toBe(200);
  });
  afterEach((done) => {
    mongoose.disconnect(done);
  });
});
