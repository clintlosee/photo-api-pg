const bcrypt = require('bcrypt');
// const { pool } = require('../config/db');
const User = require('../db/user');

//* Get user
exports.getUser = async (req, res) => {
  const { rows: user } = await User.getUserById(req.params.id);

  if (!user[0]) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({
    id: user?.[0].id,
    email: user?.[0].email,
    name: user?.[0].name,
  });
};

//* Get me
exports.getMe = async (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({
    id: user?.[0].id,
    email: user?.[0].email,
    name: user?.[0].name,
  });
};

//* Get all users
exports.getAllUsers = async (req, res) => {
  const { rows: users } = await User.getAll();

  if (!users.length) {
    return res.status(404).json({ message: 'No users found' });
  }

  return res.status(200).json(users);
};

// Create user
exports.createUser = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ message: 'Password should be at least 6 characters' });
  }

  if (password !== password2) {
    errors.push({ message: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    return res.status(422).json(errors);
  }

  try {
    const { rows: user } = await User.getUserByEmail(email);

    if (user[0]) {
      errors.push({ message: 'Email already registered' });
      return res.status(422).json(errors);
    }

    //* Use bcrypt .then method
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.createUser(name, email, hash)
          .then((data) => {
            const { rows: createdUser } = data;

            return res.status(201).json({
              user: createdUser[0],
              success: 'You are registered. Please log in.',
            });
          })
          .catch((error) => {
            errors.push({ message: error });
            return res.status(422).json(errors);
          });
      })
      .catch((error) => {
        errors.push({ message: error });
        return res.status(422).json(errors);
      });

    //* Alternate method using await
    // const hashedPassword = await bcrypt.hash(password, 10);

    // const { rows: newUser } = await User.createUser(
    //   name,
    //   email,
    //   hashedPassword
    // );

    // if (!newUser[0]) {
    //   errors.push({ message: 'There was a problem registering.' });
    //   return res.status(422).json(errors);
    // }

    // return res
    //   .status(201)
    //   .json({ success: 'You are registered. Please log in.' });
  } catch (err) {
    res.status(500).json({ error: 'There was a problem registering.' });
    throw err;
  }
};

// //* Middleware to get user id from req
// exports.getUserId = async (req, res, next) => {
//   const userId = req.params.id;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'No user found for this id' });
//     }

//     await User.find({ _id: userId }).exec((errors, user) => {
//       if (errors) {
//         return res.status(422).send({ message: errors });
//       }
//       if (!user) {
//         return res.status(404).json({ message: 'Cannot find user' });
//       }
//       res.user = user;
//       next();
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
