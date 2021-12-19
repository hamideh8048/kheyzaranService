const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});


const knex = require('knex');
const db = knex(
  {
      client: 'pg',
      connection: {
          host: 'localhost',
          user: 'postgres',
          password: '123@123',
          database: 'fahlav_poetry',
      },
  }
);
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
 
// db.files = require('../models/file.model.js')(sequelize, Sequelize);
// db.tests = require('../models/artist.model.js')(sequelize, Sequelize);
//module.exports = db;