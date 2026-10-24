const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createApp } = require('../src/app');
const { createUserRepository } = require('../src/repositories/userRepository');
const { DuplicateEmailError } = require('../src/errors');

const config = { jwtSecret: 'test-secret', jwtExpiresIn: '1h', bcryptRounds: 4 };
const valid = { email: 'Jane@Example.com', password: 'password123', name: 'Jane' };

function buildApp(createImpl) {
  const userRepository = { create: jest.fn(createImpl) };
  return { app: createApp({ userRepository, config }), userRepository };
}

describe('POST /auth/register', () => {
  let errSpy;
  beforeEach(() => { errSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => errSpy.mockRestore());

  test('registers a user and returns a signed JWT', async () => {
    const { app, userRepository } = buildApp(async (u) => ({ id: 'u-1', email: u.email, name: u.name }));
    const res = await request(app).post('/auth/register').send(valid);

    expect(res.status).toBe(201);
    expect(res.body.user).toEqual({ id: 'u-1', email: 'jane@example.com', name: 'Jane' });
    expect(res.body.user.passwordHash).toBeUndefined();

    const payload = jwt.verify(res.body.token, config.jwtSecret);
    expect(payload.sub).toBe('u-1');
    expect(payload.email).toBe('jane@example.com');

    const arg = userRepository.create.mock.calls[0][0];
    expect(arg.passwordHash).not.toBe(valid.password);
    expect(await bcrypt.compare(valid.password, arg.passwordHash)).toBe(true);
  });

  test('returns 409 for a duplicate email', async () => {
    const { app } = buildApp(async () => { throw new DuplicateEmailError(); });
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
    expect(res.body.token).toBeUndefined();
  });

  test('maps a Postgres unique violation to 409 via the repository', async () => {
    const pool = { query: jest.fn().mockRejectedValue(Object.assign(new Error('dup'), { code: '23505' })) };
    const app = createApp({ userRepository: createUserRepository(pool), config });
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(409);
  });

  describe('invalid input returns 400 and does not touch the database', () => {
    const cases = [
      ['missing email', { password: 'password123' }, 'email'],
      ['malformed email', { email: 'not-an-email', password: 'password123' }, 'email'],
      ['non-string email', { email: 123, password: 'password123' }, 'email'],
      ['missing password', { email: 'a@b.com' }, 'password'],
      ['short password', { email: 'a@b.com', password: 'abc123' }, 'password'],
      ['password too long', { email: 'a@b.com', password: 'a1'.repeat(40) }, 'password'],
      ['password without digit', { email: 'a@b.com', password: 'onlyletters' }, 'password'],
      ['empty name', { email: 'a@b.com', password: 'password123', name: '  ' }, 'name'],
    ];
    test.each(cases)('%s', async (_label, body, field) => {
      const { app, userRepository } = buildApp(async () => ({}));
      const res = await request(app).post('/auth/register').send(body);
      expect(res.status).toBe(400);
      expect(res.body.details.map((d) => d.field)).toContain(field);
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    test('empty body', async () => {
      const { app, userRepository } = buildApp(async () => ({}));
      const res = await request(app).post('/auth/register').send();
      expect(res.status).toBe(400);
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    test('malformed JSON', async () => {
      const { app } = buildApp(async () => ({}));
      const res = await request(app).post('/auth/register')
        .set('Content-Type', 'application/json').send('{bad json');
      expect(res.status).toBe(400);
    });
  });

  test('returns 500 without leaking details on database failure', async () => {
    const { app } = buildApp(async () => { throw new Error('connection refused at 10.0.0.5'); });
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
    expect(JSON.stringify(res.body)).not.toMatch(/10\.0\.0\.5/);
  });
});
