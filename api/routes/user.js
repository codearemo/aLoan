// Setup route for user
const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/user');
const Loan = require('../model/loan');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Get all users
router.get('/', (req, res, next) => {
  User.find()
    .select('-password -__v')
    .populate('loans', '-__v')
    .exec()
    .then(users => {
      res.status(200).json({
        message: 'List of all registered users',
        users: users
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

// Create User
router.post('/register', (req, res, next) => {
  const registerEmail = req.body.registerEmail;
  const registerPassword = req.body.registerPassword;

  // Encrypt password before saving
  bcrypt.hash(registerPassword, 10, (err, hash) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      const newUser = User({
        _id: mongoose.Types.ObjectId(),
        email: registerEmail,
        password: hash
      });

      newUser
        .save()
        .then(user => {
          res.status(201).json({
            message: 'Registration Successful',
            user: user
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Registration Unsuccessful',
            error: error
          });
        });
    }
  });
});

// Login User
router.post('/login', (req, res, next) => {
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;

  User.findOne({ email: loginEmail })
    .populate('loans', '-__v')
    .exec()
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: 'Authentication failed'
        });
      } else {
        bcrypt.compare(loginPassword, user.password, (error, result) => {
          if (error) {
            res.status(401).json({
              message: 'Authentication failed'
            });
          } else {
            if (result) {
              // Setup JWT
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user._id
                },
                'secret',
                {
                  expiresIn: '1h'
                }
              );

              // respond to request
              res.status(200).json({
                message: 'Authentication success',
                user_id: user._id,
                email: user.email,
                current_loans: {
                  loans: user.loans
                },
                token: token
              });
            } else {
              res.status(401).json({
                message: 'Authentication failed'
              });
            }
          }
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

// Remove User
router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'User Deleted'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

// Apply for loan
router.patch('/apply', (req, res, next) => {
  const userId = req.body.userId;
  const loanId = req.body.loanId;

  Loan.findById(loanId)
    .exec()
    .then(loan => {
      if (!loan) {
        res.status(404).json({
          message: "This loan doesn't exist"
        });
      } else {
        User.update({ _id: userId }, { $push: { loans: loanId } })
          .exec()
          .then(data => {
            res.status(200).json({
              user: data
            });
          })
          .catch(error => {
            res.status(500).json({
              message: 'Something went wrong',
              error: error
            });
          });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

module.exports = router;
