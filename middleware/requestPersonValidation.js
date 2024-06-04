const { check } = require('express-validator') // Імпортує функцію check з модуля express-validator для створення правил валідації

// Validation middleware for createPerson route
exports.createPersonValidation = [
	check('name') // Валідує поле "name"
		.isLength({ min: 1, max: 50 }) // Перевіряє, що довжина поля "name" від 1 до 50 символів
		.withMessage('Name must be between 1 and 50 characters'), // Повідомлення про помилку, якщо умова не виконана
	check('surname') // Валідує поле "surname"
		.isLength({ min: 1, max: 50 }) // Перевіряє, що довжина поля "surname" від 1 до 50 символів
		.withMessage('Surname must be between 1 and 50 characters'), // Повідомлення про помилку, якщо умова не виконана
	check('patronym') // Валідує поле "patronym"
		.optional() // Поле "patronym" є опціональним
		.isLength({ min: 0, max: 50 }) // Якщо присутнє, перевіряє, що довжина поля "patronym" не більше 50 символів
		.withMessage('Patronym must be less than 50 characters'), // Повідомлення про помилку, якщо умова не виконана
	check('dateOfBirth') // Валідує поле "dateOfBirth"
		.isDate({ format: 'YYYY-MM-DD' }) // Перевіряє, що поле "dateOfBirth" є датою у форматі 'YYYY-MM-DD'
		.withMessage('Date of birth must be a valid date in YYYY-MM-DD format'), // Повідомлення про помилку, якщо умова не виконана
	check('rnokpp') // Валідує поле "rnokpp"
		.isLength({ min: 10, max: 10 }) // Перевіряє, що довжина поля "rnokpp" дорівнює 10 символів
		.withMessage('RNOKPP must be 10 digits. Format: xxxxxxxxxx'), // Повідомлення про помилку, якщо умова не виконана
	check('unzr') // Валідує поле "unzr"
		.isLength({ min: 14, max: 14 }) // Перевіряє, що довжина поля "unzr" дорівнює 14 символів
		.withMessage('UNZR must be 14 characters long. Format: xxxxxxxx-xxxxx'), // Повідомлення про помилку, якщо умова не виконана
	check('passportNumber') // Валідує поле "passportNumber"
		.isLength({ min: 9, max: 9 }) // Перевіряє, що довжина поля "passportNumber" дорівнює 9 символів
		.withMessage('Passport number must be 9 digits. Format: xxxxxxxxx'), // Повідомлення про помилку, якщо умова не виконана
	check('gender') // Валідує поле "gender"
		.isIn(['male', 'female']) // Перевіряє, що значення поля "gender" є або "male", або "female"
		.withMessage('gender must be either "male" or "female"') // Повідомлення про помилку, якщо умова не виконана
]
