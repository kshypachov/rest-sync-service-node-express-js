const express = require('express') // Імпортуємо модуль Express
const router = express.Router() // Створюємо екземпляр маршрутизатора
const personController = require('../controllers/personController') // Імпортуємо контролер для обробки операцій, пов'язаних з особами
const {
	createPersonValidation
} = require('../middleware/requestPersonValidation') // Middleware для валідації запитів: Імпортуємо для валідації запитів за допомогою Express Validator
const { validationResult } = require('express-validator') // Імпортуємо validationResult для обробки результатів валідації
const logger = require('../middleware/logger') // Імпортуємо логер Winston

// Цей файл маршрутизатора ефективно обробляє CRUD операції для осіб, делегує операції відповідним функціям контролера та виконує валідацію запитів за допомогою middleware.

// Middleware для логування HTTP запитів
router.use((req, res, next) => {
	logger.info(`[${req.method} ${req.url}]`) // Логування методу та URL запиту
	logger.debug(`Headers: ${JSON.stringify(req.headers)}`) // Логування заголовків запиту
	logger.debug(`Body: ${JSON.stringify(req.body)}`) // Логування тіла запиту
	next() // Передача управління наступному middleware
})

// Middleware для логування відповідей
router.use((req, res, next) => {
	const oldWrite = res.write
	const oldEnd = res.end

	const chunks = []

	res.write = (...restArgs) => {
		chunks.push(Buffer.from(restArgs[0]))
		oldWrite.apply(res, restArgs)
	}

	res.end = (...restArgs) => {
		if (restArgs[0]) {
			chunks.push(Buffer.from(restArgs[0]))
		}
		const body = Buffer.concat(chunks).toString('utf8')
		logger.debug(
			`Response for ${req.method} ${req.url}: Status ${
				res.statusCode
			}, Headers: ${JSON.stringify(res.getHeaders())}, Body: ${body}`
		)
		oldEnd.apply(res, restArgs)
	}

	next() // Передача управління наступному middleware
})

// Маршрут для створення нової особи
router.post(
	'/',
	createPersonValidation, // Використання middleware для валідації запиту
	(req, res, next) => {
		// #swagger.summary = 'create Person'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to create a new person. It uses request validation middleware (createPersonValidation) to validate the request body. If there are validation errors, it logs them and returns a 422 status with the validation errors. Otherwise, it delegates the creation operation to the createPerson controller function.'
		logger.info('Creating person attempt') // Логування спроби створення особи
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			logger.warn(`Validation error: ${JSON.stringify(errors.array())}`)
			return res.status(422).json({ Validation_errors: errors.array() }) // Повернення помилок валідації
		}
		next() // Передача управління наступному middleware
	},
	personController.createPerson // Виклик функції контролера для створення особи
)

// Маршрут для отримання списку осіб за запитами
router.get(
	'/',
	(req, res, next) => {
		// #swagger.summary = 'get Persons By Query Parameters'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to get a list of persons by query parameters.Example '/person?_page=1&_limit=50&name=Adam' Delegates the operation to the getPersonsByQueryParameters controller function.'
		logger.info('Getting list of persons by query parameters') // Логування спроби отримання списку осіб за запитами
		next() // Передача управління наступному middleware
	},
	personController.getPersonsByQueryParameters // Виклик функції контролера для отримання списку осіб за запитами
)

// Маршрут для отримання особи за унікальним атрибутом
router.get(
	'/:attribute/:value',
	(req, res, next) => {
		// #swagger.summary = 'get Person By Unique Attribute'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to get a person by unique attribute like unzr,rnokpp,passportNumber or id. Delegates the operation to the getPersonByUniqueAttribute controller function.'
		logger.info(`Getting person by ${req.params.attribute} ${req.params.value}`) // Логування спроби отримання особи за унікальним атрибутом
		next() // Передача управління наступному middleware
	},
	personController.getPersonByUniqueAttribute // Виклик функції контролера для отримання особи за унікальним атрибутом
)

// Маршрут для оновлення особи за унікальним атрибутом
router.put(
	'/:attribute/:value',
	createPersonValidation, // Використання middleware для валідації запиту
	(req, res, next) => {
		// #swagger.summary = 'update Person By Unique Attribute'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to update a person by unique attribute like unzr,rnokpp,passportNumber or id. It also uses request validation middleware (updatePersonValidation) to validate the request body. If there are validation errors, it logs them and returns a 422 status with the validation errors. Otherwise, it delegates the update operation to the updatePersonByUniqueAttribute controller function.'
		logger.info('Updating person attempt') // Логування спроби оновлення особи
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			logger.warn(`Validation error: ${JSON.stringify(errors.array())}`)
			return res.status(422).json({ Validation_errors: errors.array() }) // Повернення помилок валідації
		}
		next() // Передача управління наступному middleware
	},
	(req, res, next) => {
		logger.info(
			`Updating person by ${req.params.attribute} ${req.params.value}` // Логування оновлення особи за унікальним атрибутом
		)
		next() // Передача управління наступному middleware
	},
	personController.updatePersonByUniqueAttribute // Виклик функції контролера для оновлення особи за унікальним атрибутом
)
// Маршрут для видалення особи за унікальним атрибутом
router.delete(
	'/:attribute/:value',
	(req, res, next) => {
		// #swagger.summary = 'delete Person By Unique Attribute'
		// #swagger.tags = ['Person Service']
		// #swagger.description = 'Route to delete a person by unique attribute like unzr,rnokpp,passportNumber or id. Delegates the operation to the deletePersonByUniqueAttribute controller function.'
		logger.info(
			`Deleting person by ${req.params.attribute} ${req.params.value}` // Логування спроби видалення особи за унікальним атрибутом
		)
		next() // Передача управління наступному middleware
	},
	personController.deletePersonByUniqueAttribute // Виклик функції контролера для видалення особи за унікальним атрибутом
)

module.exports = router // Експортуємо маршрутизатор для використання в інших файлах

