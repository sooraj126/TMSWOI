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


  // Tests for OnTrack routes
  describe('OnTrack API', () => {
    const userId = 'user123';
    const onTrackLink = 'http://example.com/ontrack';

    describe('GET /api/ontrack/:userId', () => {
      test('should return OnTrack link for existing user', async () => {
        OnTrack.findOne.mockResolvedValue({ onTrackLink });

        const response = await request(app).get(`/api/ontrack/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ onTrackLink });
      });

      test('should return 500 if userId is missing', async () => {
        const response = await request(app).post('/api/ontrack').send({ onTrackLink: 'http://example.com/ontrack' });
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error with OnTrack link');
    });
    
    test('should return 500 if onTrackLink is missing', async () => {
        const response = await request(app).post('/api/ontrack').send({ userId: 'user123' });
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error with OnTrack link');
    });


    test('should return 500 if OnTrack link already exists', async () => {
      OnTrack.findOne.mockResolvedValueOnce({ userId: 'user123', onTrackLink: 'http://example.com/ontrack' }); // Mock existing entry
      const response = await request(app).post('/api/ontrack').send({ userId: 'user123', onTrackLink: 'http://example.com/ontrack' });
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Error with OnTrack link');
  });
  
    
      test('should return 404 if OnTrack link not found', async () => {
        OnTrack.findOne.mockResolvedValue(null);

        const response = await request(app).get(`/api/ontrack/${userId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'OnTrack link not found.'  });
      });

      test('should return 500 if there is a server error', async () => {
        OnTrack.findOne.mockRejectedValue(new Error('Server error'));

        const response = await request(app).get(`/api/ontrack/${userId}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Error retrieving OnTrack link' });
      });
    });

    describe('POST /api/ontrack', () => {
      // test('should create new OnTrack link if it does not exist', async () => {
      //   OnTrack.findOne.mockResolvedValue(null);
      //   OnTrack.prototype.save = jest.fn().mockResolvedValue({ userId, onTrackLink });

      //   const response = await request(app).post('/api/ontrack').send({ userId, onTrackLink });
      //   expect(response.statusCode).toBe(201);
      //   expect(response.body).toEqual({ userId, onTrackLink });
      // });

      // test('should update existing OnTrack link if it exists', async () => {
      //   OnTrack.findOne.mockResolvedValue({ onTrackLink, save: jest.fn().mockResolvedValue({ userId, onTrackLink }) });

      //   const response = await request(app).post('/api/ontrack').send({ userId, onTrackLink });
      //   expect(response.statusCode).toBe(200);
      //   expect(response.body).toEqual({ userId, onTrackLink });
      // });

      test('should return 500 if there is a server error', async () => {
        OnTrack.findOne.mockRejectedValue(new Error('Server error'));

        const response = await request(app).post('/api/ontrack').send({ userId, onTrackLink });
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Error with OnTrack link' });
      });
    });
  });
});
