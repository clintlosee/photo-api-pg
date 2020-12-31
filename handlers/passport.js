const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { pool } = require('../config/db');

const User = require('../db/user');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            throw err;
          }

          if (results.rows.length > 0) {
            const user = results.rows[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                throw err;
              }
              if (!isMatch) {
                return done(null, false, { message: 'Invalid Login' });
              }

              return done(null, user);
            });
          } else {
            return done(null, false, { message: 'No user found' });
          }
        }
      );
    } catch (error) {
      console.log('error:', error);
    }
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      }

      return done(null, results.rows[0]);
    });
  });

  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      if (Date.now() > payload.exp * 1000) {
        return done('jwt expired');
      }

      const { rows: user } = await User.getUserById(payload.id);

      if (user[0]) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
  );
}

module.exports = initialize;
