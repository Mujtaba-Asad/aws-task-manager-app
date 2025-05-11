const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

const db = {
  sequelize,
  Sequelize,
  User: require('./user.model')(sequelize, Sequelize),
  Task: require('./task.model')(sequelize, Sequelize)
};

// Define relationships
db.User.hasMany(db.Task, { onDelete: 'CASCADE' });
db.Task.belongsTo(db.User);

module.exports = db;