const request = require('supertest');
const app = require('./src/app');
const jwt = require('jsonwebtoken');
const UserAccount = require('./src/models/user_account');
require('dotenv').config();

(async () => {
  try {
    const testUser = await UserAccount.create({
      first_name: 'John',
      last_name: 'Doe Profile',
      email: `john.profile.${Date.now()}@test.com`,
      password: 'password123',
      status: 'active',
      id_role: 3
    });
    const token = jwt.sign({ id: testUser.id_user, role: testUser.id_role }, process.env.JWT_SECRET || 'secret_key_temporal', { expiresIn: '1h' });
    const response = await request(app)
      .put('/api/profile_update')
      .set('Authorization', `Bearer ${token}`)
      .send({ first_name: 'John Updated', last_name: 'Doe Updated' });
    console.log('STATUS', response.status);
    console.log('BODY', JSON.stringify(response.body, null, 2));
    await UserAccount.destroy({ where: { id_user: testUser.id_user } });
  } catch (e) {
    console.error('ERROR', e.stack || e);
  } finally {
    process.exit();
  }
})();
