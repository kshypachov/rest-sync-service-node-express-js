const express = require('express') // Import Express module
const router = express.Router() // Create router instance
const personController = require('../controllers/personController') // Import personController to handle person-related operations
const {
	createPersonValidation
} = require('../middleware/requestPersonValidation') // Request validation middleware: Imported for request validation using Express Validator.
const { validationResult } = require('express-validator') // validationResult: Required to handle validation results.
const logger = require('../middleware/logger') // Import your Winston logger

//  HTTP req level logging middleware
router.use((req, res, next) => {
	logger.info(`[${req.method} ${req.url}]`)
	logger.debug(`Headers: ${JSON.stringify(req.headers)}`)
	logger.debug(`Body: ${JSON.stringify(req.body)}`)
	next()
})

// Response logging middleware
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

	next()
})

router.post(
	'/person',
	createPersonValidation,
	(req, res, next) => {
    // #swagger.summary = 'create Person'
    // #swagger.tags = ['Person Service']
    // #swagger.description = 'Route to create a new person. It uses request validation middleware (createPersonValidation) to validate the request body. If there are validation errors, it logs them and returns a 422 status with the validation errors. Otherwise, it delegates the creation operation to the createPerson controller function.'
		logger.info('Creating person attempt')
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			logger.warn(`Validation error: ${JSON.stringify(errors.array())}`)
			return res.status(422).json({ Validation_errors: errors.array() })
		}
		next()
	},
	personController.createPerson
)

router.get(
	'/person',
	(req, res, next) => {
        // #swagger.summary = 'get Persons By Query Parameters'
    // #swagger.tags = ['Person Service']
    // #swagger.description = 'Route to get a list of persons by query parameters.Example '/person?_page=1&_limit=50&name=Adam' Delegates the operation to the getPersonsByQueryParameters controller function.'
		logger.info('Getting list of persons by query parameters')
		next()
	},
	personController.getPersonsByQueryParameters
)

router.get(
	'/person/:attribute/:value',
	(req, res, next) => {
        // #swagger.summary = 'get Person By Unique Attribute'
    // #swagger.tags = ['Person Service']
    // #swagger.description = 'Route to get a person by unique attribute like unzr,rnokpp,passportNumber or id. Delegates the operation to the getPersonByUniqueAttribute controller function.'
		logger.info(`Getting person by ${req.params.attribute} ${req.params.value}`)
		next()
	},
	personController.getPersonByUniqueAttribute
)


router.put(
	'/person/:attribute/:value',
	createPersonValidation,
	(req, res, next) => {
        // #swagger.summary = 'update Person By Unique Attribute'
    // #swagger.tags = ['Person Service']
    // #swagger.description = 'Route to update a person by unique attribute like unzr,rnokpp,passportNumber or id. It also uses request validation middleware (updatePersonValidation) to validate the request body. If there are validation errors, it logs them and returns a 422 status with the validation errors. Otherwise, it delegates the update operation to the updatePersonByUniqueAttribute controller function.'
		logger.info('Updating person attempt')
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			logger.warn(`Validation error: ${JSON.stringify(errors.array())}`)
			return res.status(422).json({ Validation_errors: errors.array() })
		}
		next()
	},
	(req, res, next) => {
		logger.info(
			`Updating person by ${req.params.attribute} ${req.params.value}`
		)
		next()
	},
	personController.updatePersonByUniqueAttribute
)


router.delete(
	'/person/:attribute/:value',
	(req, res, next) => {
        // #swagger.summary = 'delete Person By Unique Attribute'
    // #swagger.tags = ['Person Service']
    // #swagger.description = 'Route to delete a person by unique attribute like unzr,rnokpp,passportNumber or id. Delegates the operation to the deletePersonByUniqueAttribute controller function.'
		logger.info(
			`Deleting person by ${req.params.attribute} ${req.params.value}`
		)
		next()
	},
	personController.deletePersonByUniqueAttribute
)

module.exports = router // Export the router to make it available for use in other files

//This router file efficiently handles CRUD operations for persons, delegates the operations to the appropriate controller functions, and performs request validation using middleware.
