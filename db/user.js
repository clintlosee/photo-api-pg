const { pool } = require('../config/db');

module.exports = {
  getAll() {
    return pool.query(`SELECT id, email, name FROM users`);
  },
  getUserById(id) {
    return pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  },
  getUserByEmail(email) {
    return pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  },
  createUser(name, email, hashedPassword) {
    return pool.query(
      `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, email
      `,
      [name, email, hashedPassword]
    );
  },
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
