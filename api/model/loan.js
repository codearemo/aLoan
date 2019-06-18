const mongoose = require('mongoose');

const loanSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String, required: true },
  interest_rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  tenure: { type: String, required: true },
  startDate: { type: Date, require: true },
  endDate: { type: Date, require: true }
});

module.exports = mongoose.model('Loan', loanSchema);
