const request = require('supertest');
const app = require('../server'); // Adjust the path to your app.js file
const User = require('../backend/Models/user.model');
const randomEmail = require('random-email')
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

// Mock Mongoose to prevent actual database connection
jest.mock('mongoose', () => ({
  connect: jest.fn(() => Promise.resolve()),
}));

// Mock the User model
jest.mock('../backend/Models/user.model', () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    validateUser: jest.fn(() => ({ error: null })), // Added validateUser mock
    save: jest.fn(),
  };
});

jest.mock('bcrypt', () => ({
    compare: jest.fn(() => Promise.resolve(true)),
    hash: jest.fn(() => Promise.resolve('hashedpassword')),
    genSalt: jest.fn(() => Promise.resolve('salt')), // Mock genSalt as well
  }));
  


describe('Express App', () => {
  // Test the GET routes serving HTML files
  test('GET / should return index.html', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('GET /login should return login.html', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('GET /signup should return signup.html', async () => {
    const response = await request(app).get('/signup');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('GET /ontrack should return ontrack.html', async () => {
    const response = await request(app).get('/ontrack');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('GET /task should return task.html', async () => {
    const response = await request(app).get('/task');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  // Test the API routes
describe('POST /api/register', () => {
    test('should return 400 if password and confirm-password do not match', async () => {
        const response = await request(app)
        .post('/api/register')
        .send({ name: 'Test', email: 'test@test.com', password: 'password', 'confirm-password': 'password1' });
        expect(response.statusCode).toBe(400);
    });
    
    test('should return 400 if user already exists', async () => {
        const response = await request(app)
        .post('/api/register')
        .send({ name: 'Test',email: 'test@test.com', password: 'password', 'confirm-password': 'password1' });
        expect(response.statusCode).toBe(400);
    });
    test('should return 400 if user validation fails', async () => {
        User.findOne.mockResolvedValue(null);
        User.validateUser.mockReturnValue({ error: { details: [{ message: 'error' }] } });
        const response = await request(app)
        .post('/api/register')
        .send({ name: 'Test', email: '123', password: 'password', 'confirm-password': 'password' });
        expect(response.statusCode).toBe(400);
    });
    test('should return 400 if an user exist occurs', async () => {
        User.findOne.mockRejectedValue(new Error('error'));
        const response = await request(app)
        .post('/api/register')
        .send({ name: 'Test', email: 'test@test.com', password: 'password', 'confirm-password': 'password' });
        expect(response.statusCode).toBe(400);
    });

});
});
