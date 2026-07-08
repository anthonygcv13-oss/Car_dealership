const sequelize = require('./src/config/db.js');
const { UserAccount } = require('./src/models/associations.js');
const bcrypt = require('bcrypt');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database:', sequelize.config.database);

    // Look for anthonygcv13@gmail.com
    let user = await UserAccount.findOne({ where: { email: 'anthonygcv13@gmail.com' } });
    
    if (user) {
      console.log('Found user anthonygcv13@gmail.com, updating email to anthonygcv1@gmail.com...');
      const hashedPassword = await bcrypt.hash('Ac30921446', 10);
      user.email = 'anthonygcv1@gmail.com';
      user.password = hashedPassword;
      await user.save();
      console.log('User successfully updated!');
    } else {
      // Look for anthonygcv1@gmail.com
      user = await UserAccount.findOne({ where: { email: 'anthonygcv1@gmail.com' } });
      if (user) {
        console.log('Found user anthonygcv1@gmail.com, updating password...');
        const hashedPassword = await bcrypt.hash('Ac30921446', 10);
        user.password = hashedPassword;
        await user.save();
        console.log('User password successfully updated!');
      } else {
        console.log('Neither anthonygcv13@gmail.com nor anthonygcv1@gmail.com found! Creating new user anthonygcv1@gmail.com...');
        const hashedPassword = await bcrypt.hash('Ac30921446', 10);
        await UserAccount.create({
          first_name: 'Anthony',
          last_name: 'Gonzalez',
          email: 'anthonygcv1@gmail.com',
          password: hashedPassword,
          status: 'active',
          id_role: 1
        });
        console.log('User created successfully!');
      }
    }
  } catch (error) {
    console.error('Error updating credentials:', error);
  } finally {
    await sequelize.close();
  }
}

run();
