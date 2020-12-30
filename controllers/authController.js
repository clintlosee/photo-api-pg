const passport = require('passport');
const jwt = require('jsonwebtoken'); // import passport and passport-jwt modules
const initializePassport = require('../handlers/passport');

initializePassport(passport);

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

  passport.authenticate(
    'local',
    { failureFlash: true, session: false },
    (err, user, message) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(422).send({
          errors: {
            message,
          },
        });
      }

      const payload = { id: user.id };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        },
        (err, token) => {
          res.cookie('jwt', token, { httpOnly: true, secure: true });
          res.status(200).json({
            success: true,
            token,
            // token: `Bearer ${token}`,
            // role: user[0].dataValues.role,
          });
        }
      );
    }
  )(req, res, next);
};

exports.logout = function (req, res) {
  req.logOut();
  return res.json({ message: 'You are now logged out' });
};

// exports.checkAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//     // return res.json({ message: 'Authenticated' });
//   }
//   return res.json({ message: 'Not Authenticated' });
// };

// exports.checkNotAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   return res.json({ message: 'Not Authenticated' });
// };
