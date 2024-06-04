const logger = require('../middleware/logger') // Логер: Імпортується для логування за допомогою Winston.
const models = require('../models/index') // Моделі: Імпортуються для доступу до моделей Sequelize для взаємодії з базою даних.

// У Sequelize, коли ви викликаєте метод create() для моделі (у цьому випадку, моделі Person), Sequelize генерує та виконує запит SQL INSERT, щоб вставити новий запис у відповідну таблицю бази даних.
// Створює новий запис особи в базі даних за допомогою моделі Person. Отримує дані особи як параметри та вставляє їх у базу даних за допомогою методу create() Sequelize.
exports.createPerson = async personData => {
	try {
		const newPerson = await models.Person.create(personData)
		logger.info(`Created person: ${JSON.stringify(newPerson)}`)
		return newPerson
	} catch (error) {
		// Обробка для SequelizeUniqueConstraintError, який є типом помилки, що виникає, коли унікальне обмеження в базі даних порушується.
		if (error.name === 'SequelizeUniqueConstraintError') {
			const errorMessage = error.errors.map(err => err.message).join('; ')
			logger.error(`DB Error creating person: ${errorMessage}`)
			throw new Error(errorMessage) // Викидає повідомлення про порушення унікального обмеження
		} else {
			logger.error(`Error creating person: ${error}`)
			throw new Error('Failed to create person')
		}
	}
}

// Отримує осіб з бази даних на основі параметрів запиту. Створює запит Sequelize за допомогою наданих параметрів і повертає відповідних осіб.
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
// Отримує кількість осіб в базі даних на основі параметрів запиту.
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

// Отримує одну особу з бази даних на основі унікального атрибуту (наприклад, ID, unzr, rnokpp, passportNumber). Створює where clause на основі атрибуту та значення і виконує запит до бази даних для пошуку особи.
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

// Оновлює особу в базі даних на основі унікального атрибуту. Створює where clause на основі атрибуту та значення, оновлює дані особи наданими новими даними і повертає оновлену особу.
exports.updatePersonByUniqueAttribute = async (
	attribute,
	value,
	name,
	surname,
	patronym,
	dateOfBirth,
	rnokpp,
	unzr,
	passportNumber,
	gender
) => {
	try {
		const [updatedRowsCount, updatedPersons] = await models.Person.update(
			{
				name,
				surname,
				patronym,
				dateOfBirth,
				rnokpp,
				unzr,
				passportNumber,
				gender
			},
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
			throw new Error(errorMessage) // Викидає повідомлення про порушення унікального обмеження
		} else {
			logger.error(`Error updating person by unique attribute: ${error}`)
			throw new Error(error.message)
		}
	}
}

// Видаляє особу з бази даних на основі унікального атрибуту. Створює where clause на основі атрибуту та значення і видаляє відповідну особу з бази даних.
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
		} // Відповідь про успіх
	} catch (error) {
		logger.error(`Error deleting person by unique attribute: ${error.message}`)
		throw new Error(error.message)
	}
}

// Кожна функція сервісу обгортає свої операції з базою даних у блок try-catch для перехоплення можливих помилок. Якщо виникає помилка, вона логує повідомлення про помилку і викидає помилку для обробки викликачем.

// Файл personService.js ефективно інкапсулює бізнес-логіку для обробки CRUD операцій з особами, взаємодіє з базою даних за допомогою моделей Sequelize і виконує обробку помилок.
