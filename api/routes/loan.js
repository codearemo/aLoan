const express = require('express');
const Loan = require('../model/loan');

const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res, next) => {
  Loan.find()
    .exec()
    .then(loans => {
      res.status(200).json({
        message: 'List of all Loans',
        loans: loans
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  // Get the tenure (in months)
  function diff_months(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60 * 24 * 7 * 4;
    let totalMonths = Math.abs(Math.round(diff));
    let numOfYears = Math.floor(totalMonths / 12);
    let remainingMonths = totalMonths % 12;
    // For years count
    if (numOfYears > 0) {
      if (numOfYears == 1) {
        numOfYears = numOfYears + 'yr';
      } else {
        numOfYears = numOfYears + 'yrs';
      }
    } else {
      numOfYears = '';
    }

    // For months count
    if (remainingMonths > 0) {
      if (remainingMonths == 1) {
        remainingMonths = ' ' + remainingMonths + ' mnth';
      } else {
        remainingMonths = ' ' + remainingMonths + ' mnths';
      }
    } else {
      remainingMonths = '';
    }
    return numOfYears + remainingMonths;
  }

  const newLoan = new Loan({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    interest_rate: req.body.interest_rate,
    amount: req.body.amount,
    tenure: diff_months(
      new Date(req.body.endDate),
      new Date(req.body.startDate)
    ),
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });

  newLoan
    .save()
    .then(loan => {
      res.status(200).json({
        loan: loan
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});

router.delete('/:loanId', (req, res, next) => {
  Loan.remove({ _id: req.params.loanId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Loan Deleted'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

module.exports = router;
