const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createApp } = require('../src/app');

const config = { jwtSecret: 'test-secret', jwtExpiresIn: '1h', bcryptRounds: 4 };
const valid = { email: 'Alice@Example.com', password: 'Passw0rdOK', name: 'Alice' };

function setup(queryImpl) {
  const pool = { query: jest.fn(queryImpl) };
  return { pool, app: createApp({ pool, config }) };
}

describe('POST /auth/register', () => {
  let errSpy;
  beforeEach(() => { errSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => errSpy.mockRestore());

  test('registers a user and returns a signed JWT', async () => {
    const { app, pool } = setup(async (sql) =>
      sql.startsWith('SELECT')
        ? { rows: [] }
        : { rows: [{ id: 7, email: 'alice@example.com', name: 'Alice' }] }
    );
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.user).toEqual({ id: 7, email: 'alice@example.com', name: 'Alice' });
    expect(res.body.user.password_hash).toBeUndefined();
    const decoded = jwt.verify(res.body.token, 'test-secret');
    expect(decoded.sub).toBe('7');
    expect(decoded.email).toBe('alice@example.com');
    const insertArgs = pool.query.mock.calls[1][1];
    expect(insertArgs[2]).not.toBe(valid.password);
    expect(await bcrypt.compare(valid.password, insertArgs[2])).toBe(true);
  });

  test('returns 409 when the email already exists', async () => {
    const { app, pool } = setup(async () => ({ rows: [{ id: 1, email: 'alice@example.com' }] }));
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('returns 409 when a unique violation happens on insert (race)', async () => {
    const { app } = setup(async (sql) => {
      if (sql.startsWith('SELECT')) return { rows: [] };
      throw Object.assign(new Error('dup'), { code: '23505' });
    });
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(409);
  });

  test.each([
    ['missing body fields', {}],
    ['bad email', { ...valid, email: 'not-an-email' }],
    ['short password', { ...valid, password: 'a1' }],
    ['password without digit', { ...valid, password: 'onlyletters' }],
    ['empty name', { ...valid, name: '  ' }],
    ['non-string password', { ...valid, password: 12345678 }],
  ])('returns 400 for invalid input: %s', async (_label, body) => {
    const { app, pool } = setup(async () => ({ rows: [] }));
    const res = await request(app).post('/auth/register').send(body);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('returns 400 for malformed JSON', async () => {
    const { app } = setup(async () => ({ rows: [] }));
    const res = await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send('{bad');
    expect(res.status).toBe(400);
  });

  test('returns generic 500 on database failure without leaking details', async () => {
    const { app } = setup(async () => { throw new Error('connection refused to db-host:5432'); });
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(res.body)).not.toContain('db-host');
  });

  test('returns 500 when the insert fails after the lookup', async () => {
    const { app } = setup(async (sql) => {
      if (sql.startsWith('SELECT')) return { rows: [] };
      throw new Error('disk full');
    });
    const res = await request(app).post('/auth/register').send(valid);
    expect(res.status).toBe(500);
  });
});
