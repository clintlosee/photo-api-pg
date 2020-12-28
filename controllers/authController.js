const passport = require('passport');
const jwt = require('jsonwebtoken'); // import passport and passport-jwt modules
// const passportJWT = require('passport-jwt'); // ExtractJwt to help extract the token
const { ExtractJwt } = require('passport-jwt');
const initializePassport = require('../handlers/passport');

initializePassport(passport);

// JwtStrategy which is the strategy for the authentication
const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

// exports.onlyAuthUser = passport.authenticate('local', { session: true });
exports.onlyAuthUser = passport.authenticate('jwt', { session: false });

exports.login = function (req, res, next) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({
      errors: {
        email: 'Email is required',
        message: 'Email is required',
      },
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        password: 'Password is required',
        message: 'Password is required',
      },
    });
  }

  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(422).send({
        errors: {
          message: 'Invalid password or email!',
        },
      });
    }

    const payload = { id: user.id };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        res.json({
          success: true,
          token,
          // token: `Bearer ${token}`,
          // role: user[0].dataValues.role,
        });
      }
    );
    // return res.json({ msg: 'ok', token });

    // return res.json({
    //   id: user.id,
    //   email: user.email,
    //   name: user.name,
    // });
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  return res.json({ message: 'You are now logged out' });
};

// exports.checkAuthenticated = function (req, res, next) {
//   console.log('req:', req.isAuthenticated());
//   if (req.isAuthenticated()) {
//     return res.json({ message: 'Authenticated' });
//   }
//   next();
// };

// exports.checkNotAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   return res.json({ message: 'Not Authenticated' });
// };
