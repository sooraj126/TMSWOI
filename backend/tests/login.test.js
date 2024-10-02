const request = require('supertest');
const bcrypt = require('bcryptjs');
const { User } = require('../Models/user.model.js');
const mongoose = require('mongoose');
const app = require('../../server.js');  

// Test suite for login
describe('POST /login', () => {

    // Create a test user before each test
    beforeEach(async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({ 
            name: 'John Doe', 
            email: 'johndoe@example.com', 
            password: hashedPassword 
        });
    });

    // Cleanup database after each test
    afterEach(async () => {
        await User.deleteMany({});
    });

    // Close the MongoDB connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should login successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'johndoe@example.com', password: 'password123' });

        expect(response.statusCode).toBe(302);  
        expect(response.headers.location).toBe('/task');  
    });

    test('should return 400 for invalid email', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'invalidemail@example.com', password: 'password123' });

        expect(response.statusCode).toBe(400);  
        expect(response.text).toBe('Invalid email or password.');
    });

    test('should return 400 for incorrect password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'johndoe@example.com', password: 'wrongpassword' });

        expect(response.statusCode).toBe(400);  
        expect(response.text).toBe('Invalid email or password.');
    });

    test('should handle server errors gracefully', async () => {
        
        const findOneMock = jest.spyOn(User, 'findOne').mockImplementation(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'johndoe@example.com', password: 'password123' });

        expect(response.statusCode).toBe(500);  
        expect(response.text).toBe('An error occurred.');

        
        findOneMock.mockRestore();
    });
});
