// Setup user schema
const mongoose = require('mongoose');

const userSchma = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String, required: true },
  loans: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Loan',
      default: ['5d090a6ea0337486a8d0f5fb', '5d090ae5a0337486a8d0f5ff']
    }
  ]
});

module.exports = mongoose.model('User', userSchma);

// default: ['5d090a6ea0337486a8d0f5fb', '5d090ae5a0337486a8d0f5ff']
