describe('resolveDatabaseConnectionString', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('prefiere la base de datos local en desarrollo', () => {
    process.env.NODE_ENV = 'development';
    process.env.DATABASE_URL_LOCAL = 'postgres://local-db';
    process.env.DATABASE_URL_NEON = 'postgres://neon-db';

    const { resolveDatabaseConnectionString } = require('../src/config/db.js');

    expect(resolveDatabaseConnectionString()).toBe('postgres://local-db');
  });

  test('usa Neon en producción', () => {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL_LOCAL = 'postgres://local-db';
    process.env.DATABASE_URL_NEON = 'postgres://neon-db';

    const { resolveDatabaseConnectionString } = require('../src/config/db.js');

    expect(resolveDatabaseConnectionString()).toBe('postgres://neon-db');
  });
});
