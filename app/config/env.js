const env = {
  database: 'fahlav_poetry',
  username: 'postgres',
  password: '123@123',
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
 
module.exports = env;
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "fahlav_poetry",
//   password: "123@123",
//   port: 5432
// });