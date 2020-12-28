const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../db/user');
const { pool } = require('../config/db');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
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
              return done(null, false, { message: 'Bad Password' });
            }

            // jwt.sign(
            //   payload,
            //   'secret',
            //   {
            //     expiresIn: 3600,
            //   },
            //   (err, token) => {
            //     res.json({
            //       success: true,
            //       token: `Bearer ${token}`,
            //       role: user[0].dataValues.role,
            //     });
            //   }
            // );

            return done(null, user);
          });
        } else {
          return done(null, false, { message: 'No user found' });
        }
      }
    );
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

  passport.use(
    new JwtStrategy(jwtOptions, async (payload, next) => {
      const { rows: user } = await User.getUserById(payload.id);

      if (user[0]) {
        next(null, user);
      } else {
        next(null, false);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    console.log('id:', id);
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      }

      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
