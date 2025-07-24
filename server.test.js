const request = require('supertest');
const fs = require('fs');
const app = require('./server');

// Ensure clean db for tests
beforeEach(() => {
  fs.writeFileSync('users.json', JSON.stringify({ users: [] }));
});

describe('auth and tickets', () => {
  test('login and add ticket', async () => {
    const agent = request.agent(app);
    await agent.post('/login').send({ username: 'test', password: '123' }).expect(200);
    await agent.post('/tickets').send({ items: [], total: 5 }).expect(200);
    const res = await agent.get('/tickets').expect(200);
    expect(res.body.length).toBe(1);
  });

  test('cannot access tickets without login', async () => {
    await request(app).get('/tickets').expect(401);
  });
});
