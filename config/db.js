require('dotenv').config();
const { Pool, Client } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'dev';
console.log(process.env.NODE_ENV);

const connectionStringLocal = `postgresql://${process.env.DB_LOCAL_USER}:${process.env.DB_LOCAL_PASSWORD}@${process.env.DB_LOCAL_HOST}:${process.env.DB_LOCAL_PORT}/${process.env.DB_LOCAL_DEV_DATABASE}`;
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DEV_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? connectionString : connectionStringLocal,
  // connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DEV_DATABASE,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  //* Turn on for heroku connection
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// client.on('connect', () => {
//   console.log('connected to db');
// });

pool.on('connect', () => {
  console.log('connected to db');
});

module.exports = { pool };
