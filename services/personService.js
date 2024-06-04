const logger = require('../middleware/logger') // logger: Imported for logging using Winston.
const models = require('../models/index') // models: Imported to access Sequelize models for interacting with the database.

// Creates a new person record in the database using the Person model. It receives person data as parameters and inserts it into the database using Sequelize's create() method.
// In Sequelize, when you call the create() method on a model (in this case, the Person model), Sequelize generates and executes an SQL INSERT query to insert a new record into the corresponding database table.
exports.createPerson = async personData => {
	try {
		const newPerson = await models.Person.create(personData)
		logger.info(`Created person: ${JSON.stringify(newPerson)}`)
		return newPerson
	} catch (error) {
		// handling for SequelizeUniqueConstraintError, which is a type of error thrown by Sequelize when a unique constraint in your database is violated.
		if (error.name === 'SequelizeUniqueConstraintError') {
			const errorMessage = error.errors.map(err => err.message).join('; ')
			logger.error(`DB Error creating person: ${errorMessage}`)
			throw new Error(errorMessage) // Throw the unique constraint violation error message
		} else {
			logger.error(`Error creating person: ${error}`)
			throw new Error('Failed to create person')
		}
	}
}

// Retrieves persons from the database based on query parameters. It constructs a Sequelize query using the provided parameters and returns the matching persons.
exports.getPersonsByQueryParameters = async (
	queryParameters,
	offset,
	limit
) => {
	try {
		const persons = await models.Person.findAll({
			where: queryParameters,
			offset,
			limit
		})
		logger.info(
			`Retrieved ${
				persons.length
			} persons by query parameters: ${JSON.stringify(queryParameters)}`
		)
		return persons
	} catch (error) {
		logger.error(`Error getting persons by query parameters: ${error.message}`)
		throw new Error('Failed to get persons')
	}
}

exports.getPersonsByQueryParametersCount = async queryParameters => {
	try {
		const totalCount = await models.Person.count({ where: queryParameters })
		logger.info(`Total count of persons by query parameters: ${totalCount}`)
		return totalCount
	} catch (error) {
		logger.error(
			`Error getting persons by query parameters count: ${error.message}`
		)
		throw new Error('Failed to get persons count')
	}
}

// Retrieves a single person from the database based on a unique attribute (e.g., ID, email). It constructs a where clause based on the attribute and value and queries the database to find the person.
exports.getPersonByUniqueAttribute = async (attribute, value) => {
	try {
		const person = await models.Person.findOne({
			where: { [attribute]: value }
		})
		if (!person) {
			throw new Error('Person not found')
		}
		logger.debug(
			`Retrieved person by unique attribute (${attribute}): ${JSON.stringify(
				person
			)}`
		)
		return person
	} catch (error) {
		logger.error(`Error getting person by unique attribute: ${error.message}`)
		throw new Error(error.message)
	}
}

// Updates a person in the database based on a unique attribute. It constructs a where clause based on the attribute and value, updates the person's data with the provided newData, and returns the updated person.
exports.updatePersonByUniqueAttribute = async (attribute, value, newData) => {
	try {
		const [updatedRowsCount, updatedPersons] = await models.Person.update(
			newData,
			{ where: { [attribute]: value }, returning: true }
		)
		if (updatedRowsCount === 0) {
			throw new Error('Person not found')
		}
		logger.info(`Updated person by unique attribute (${attribute}): ${value}`)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			const errorMessage = error.errors.map(err => err.message).join('; ')
			logger.error(`DB Error updating person: ${errorMessage}`)
			throw new Error(errorMessage) // Throw the unique constraint violation error message
		} else {
			logger.error(`Error updating person by unique attribute: ${error}`)
			throw new Error(error.message)
		}
	}
}

// FDeletes a person from the database based on a unique attribute. It constructs a where clause based on the attribute and value and deletes the matching person from the database.
exports.deletePersonByUniqueAttribute = async (attribute, value) => {
	try {
		const deletedRowsCount = await models.Person.destroy({
			where: { [attribute]: value }
		})
		if (deletedRowsCount === 0) {
			throw new Error('Person not found')
		}
		logger.info(`Deleted person by unique attribute (${attribute}): ${value}`)
		return {
			message: `Person with ${attribute} = ${value} was deleted successfully.`
		} // Success response
	} catch (error) {
		logger.error(`Error deleting person by unique attribute: ${error.message}`)
		throw new Error(error.message)
	}
}

// Each service function wraps its database operations in a try-catch block to catch any potential errors. If an error occurs, it logs the error message and throws the error to be handled by the caller.

// personService.js file effectively encapsulates the business logic for handling CRUD operations on persons, interacts with the database using Sequelize models, and performs error handling.
