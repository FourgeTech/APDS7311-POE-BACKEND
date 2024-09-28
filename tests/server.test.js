const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
    it('should return 200 OK and a welcome message', async () => {
      const res = await request(app).get('/');
      
      // Assert that the status code is 200
      expect(res.statusCode).toBe(200);
      
      // Assert the response body contains the correct message
      expect(res.body).toHaveProperty('message', 'Customer International Payments Portal API is running');
    });
  });
