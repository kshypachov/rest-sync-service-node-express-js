// requestPersonValidation.js

const { check } = require('express-validator')

// Validation middleware for createPerson route
exports.createPersonValidation = [
	check('name')
		.isLength({ min: 1, max: 50 })
		.withMessage('Name must be between 1 and 50 characters'),
	check('surname')
		.isLength({ min: 1, max: 50 })
		.withMessage('Surname must be between 1 and 50 characters'),
	check('patronym')
		.optional()
		.isLength({ min: 0, max: 50 })
		.withMessage('Patronym must be less than 50 characters'),
	check('dateOfBirth')
		.isDate({ format: 'YYYY-MM-DD' })
		.withMessage('Date of birth must be a valid date in YYYY-MM-DD format'),
	check('rnokpp')
		.isLength({ min: 10, max: 10 })
		.withMessage('RNOKPP must be 10 digits. Format: xxxxxxxxxx'),
	check('unzr')
		.isLength({ min: 14, max: 14 })
		.withMessage('UNZR must be 14 characters long. Format: xxxxxxxx-xxxxx'),
	check('passportNumber')
		.isLength({ min: 9, max: 9 })
		.withMessage('Passport number must be 9 digits. Format: xxxxxxxxx'),
	check('gender')
		.isIn(['male', 'female'])
		.withMessage('gender must be either "male" or "female"')
]

