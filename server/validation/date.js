const Validator = require('validator');
const isEmpty = require('./isEmpty');
const path = require('path');
const fs = require('fs');

module.exports = function validateDate(data) {
    let errors = {};

    data.startDate = !isEmpty(data.params.startDate) ? data.params.startDate : '';
    data.endDate = !isEmpty(data.params.endDate) ? data.params.endDate : '';

    if (!Validator.isEmpty(data.startDate)) {
        errors.startDate = 'Start Date is required';
    }

    if (!Validator.isEmpty(data.endDate)) {
        errors.endDate = 'End Date is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}