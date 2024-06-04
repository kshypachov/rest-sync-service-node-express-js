// personController.js

const { log } = require('winston')
const logger = require('../middleware/logger') // Import logger for logging using Winston
const personService = require('../services/personService') // Import personService to handle CRUD operations on persons

// Controller Functions:

// Handles creating a new person. Delegates creation operation to personService.createPerson().
// Returns the newly created person with a status code of 201 if successful, or logs and returns an error response with status code 500 if an error occurs.
exports.createPerson = async (req, res) => {
	try {
		const {
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		} = req.body
		const newPerson = await personService.createPerson({
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		})
		res.status(201).json(newPerson)
	} catch (error) {
		logger.error(`Controller Error creating person: ${error.message}`)
		res.status(500).json({ error: error.message }) // Send the actual error message to the client
	}
}

// Handles getting persons by query parameters. Delegates operation to personService.getPersonsByQueryParameters().
// Returns the list of persons with a status code of 200 if successful, or logs and returns an error response with status code 500 if an error occurs.
exports.getPersonsByQueryParameters = async (req, res) => {
	try {
		const {
			_page = 1,
			_limit = 10,
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		} = req.query
		const queryParameters = {
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		}
    const filteredQueryParameters = Object.fromEntries(
      Object.entries(queryParameters).filter(([key, value]) => value !== undefined)
  );
		const offset = (_page - 1) * _limit
		// Parse _limit as integer
		const limit = parseInt(_limit)
		const persons = await personService.getPersonsByQueryParameters(
			filteredQueryParameters,
			offset,
			limit
		)
    console.log(persons.length);
		if (persons.length==0) {
			return res.status(404).json({ error: 'Zero persons found' })
		}
		// Retrieve total count of records (before pagination)
		const totalCount = await personService.getPersonsByQueryParametersCount(
			filteredQueryParameters
		)
		// Set X-Total-Count header
		res.set('X-Total-Count', totalCount)
		res.status(200).json(persons)
	} catch (error) {
		console.error(`Error getting persons: ${error.message}`)
		res.status(500).json({ error: 'Failed to get persons' })
	}
}

// Handles getting a person by unique attribute. Delegates operation to personService.getPersonByUniqueAttribute().
// Returns the found person with a status code of 200 if successful, or a 'Person not found' response with status code 404 if the person does not exist,
// or logs and returns an error response with status code 500 if an error occurs.
exports.getPersonByUniqueAttribute = async (req, res) => {
	try {
		const { attribute, value } = req.params
		const person = await personService.getPersonByUniqueAttribute(
			attribute,
			value
		)
		if (!person) {
			return res.status(404).json({ error: 'Person not found' })
		}
		res.status(200).json(person)
	} catch (error) {
		logger.error(`Error getting person: ${error.message}`)
		res.status(500).json({ error: `Failed to get person:${error.message}` })
	}
}

// Handles updating a person by unique attribute. Delegates operation to personService.updatePersonByUniqueAttribute().
// Returns the updated person with a status code of 200 if successful, or logs and returns an error response with status code 500 if an error occurs.
exports.updatePersonByUniqueAttribute = async (req, res) => {
	try {
		const { attribute, value } = req.params
		await personService.updatePersonByUniqueAttribute(
			attribute,
			value,
			req.body
		)
		res.status(200).json('Person updated')
	} catch (error) {
		logger.error(`Error updating person: ${error.message}`)
		res.status(500).json({ error: `Error updating person:${error.message}` })
	}
}

// Handles deleting a person by unique attribute. Delegates operation to personService.deletePersonByUniqueAttribute().
// Returns a success response with status code 204 if successful, or logs and returns an error response with status code 500 if an error occurs.
exports.deletePersonByUniqueAttribute = async (req, res) => {
	try {
		const { attribute, value } = req.params
		const result = await personService.deletePersonByUniqueAttribute(
			attribute,
			value
		)
		res.status(200).json(result) // Respond with the success message
	} catch (error) {
		if (error.message === 'Person not found') {
			res.status(404).json({ error: error.message })
		} else {
			logger.error(`Error deleting person: ${error.message}`)
			res
				.status(500)
				.json({ error: `Failed to delete person: ${error.message}` })
		}
	}
}
//Error handling is implemented using try-catch blocks to catch any potential errors that may occur during database operations. Errors are logged using the logger and appropriate error responses are sent back to the client.

// personController.js file efficiently handles CRUD operations for persons, delegates the operations to the personService, and performs error handling using try-catch blocks. It follows a clean and organized structure, which is good for maintainability.
