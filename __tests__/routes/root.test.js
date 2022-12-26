const request = require('supertest');
const connectDB = require('../../config/dbConn');
const app = require('../../app');
const mongoose = require('mongoose/index.js');

describe('Good index routes', () => {
  test('GET / as html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /index', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET / as json', async () => {
    const res = await request(app).get('/').set({ Accept: 'application/json' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Welcome!' });
  });
});

describe('Good dish routes', () => {
  beforeEach(async () => {
    await connectDB();
  });
  test('responds to /dishes', async () => {
    const res = await request(app).get('/dishes?en=').set({ Accept: 'application/json' });
    // console.log(res.body);
    expect(res.statusCode).toBe(200);
  });
  afterEach((done) => {
    mongoose.disconnect(done);
  });
});
