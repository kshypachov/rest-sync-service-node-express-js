// personController.js

const logger = require('../middleware/logger') // Імпортуємо логер для логування за допомогою Winston
const personService = require('../services/personService') // Імпортуємо personService для обробки CRUD операцій з особами

// Функції контролера:
// Обробляє створення нової особи. Делегує операцію створення функції personService.createPerson().
// Повертає новостворену особу зі статусом 201, якщо успішно, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка. В разі неможливості обробки запиту через конфлікти унікальності записів  повертає відповідь з помилкою зі статусом 409.
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
		logger.info(`Created person: ${JSON.stringify(newPerson)}`)
		res.status(201).json(newPerson)
	} catch (error) {
		// Обробка для SequelizeUniqueConstraintError, який є типом помилки, що виникає, коли унікальне обмеження в базі даних порушується.
		if (error.name === 'SequelizeUniqueConstraintError') {
			const errorMessage = error.errors.map(err => err.message).join('; ')
			logger.error(`DB Error creating person: ${errorMessage}`)
			res.status(409).json({ error: errorMessage }) // Відправлення фактичного повідомлення про помилку клієнту
		} else {
			logger.error(`Error creating person: ${error.message}`)
			res
				.status(500)
				.json({ error: `Failed to create person ${error.message}` }) // Відправлення фактичного повідомлення про помилку клієнту
		}
	}
}

// Обробляє отримання осіб за параметрами запиту. Делегує операцію функції personService.getPersonsByQueryParameters().
// Повертає список осіб зі статусом 200, якщо успішно, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка.
// В разі відсутності записів в БД повертає відповідь з помилкою зі статусом 404.
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
			Object.entries(queryParameters).filter(
				([key, value]) => value !== undefined
			)
		)
		const offset = (_page - 1) * _limit
		// Перетворення _limit у ціле число
		const limit = parseInt(_limit)
		const persons = await personService.getPersonsByQueryParameters(
			filteredQueryParameters,
			offset,
			limit
		)
		logger.info(
			`Retrieved ${
				persons.length
			} persons by query parameters: ${JSON.stringify(queryParameters)}`
		)
		if (persons.length == 0) {
			return res.status(404).json({ error: 'Zero persons found' })
		}
		// Отримання загальної кількості записів (до пагінації)
		const totalCount = await personService.getPersonsByQueryParametersCount(
			filteredQueryParameters
		)
		logger.info(`Total count of persons by query parameters: ${totalCount}`)
		// Встановлення заголовка X-Total-Count
		res.set('X-Total-Count', totalCount)
		res.status(200).json(persons)
	} catch (error) {
		logger.error(`Error getting persons by query parameters: ${error.message}`)
		res.status(500).json({
			error: `Error getting persons by query parameters: ${error.message}`
		})
	}
}

// Обробляє отримання особи за унікальним атрибутом. Делегує операцію функції personService.getPersonByUniqueAttribute().
// Повертає знайдену особу зі статусом 200, якщо успішно, або відповідь 'Person not found' зі статусом 404, якщо особа не існує,
// або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка.
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
		logger.debug(
			`Retrieved person by unique attribute (${attribute}): ${JSON.stringify(
				person
			)}`
		)
		res.status(200).json(person)
	} catch (error) {
		logger.error(`Error getting person by unique attribute: ${error.message}`)
		res.status(500).json({ error: `Failed to get person:${error.message}` })
	}
}

// Обробляє оновлення особи за унікальним атрибутом. Делегує операцію функції personService.updatePersonByUniqueAttribute().
// Повертає оновлену особу зі статусом 200, якщо успішно, або відповідь 'Person not found' зі статусом 404, якщо особа не існує, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка. В разі неможливості обробки запиту через конфлікти унікальності записів  повертає відповідь з помилкою зі статусом 409.
exports.updatePersonByUniqueAttribute = async (req, res) => {
	try {
		const { attribute, value } = req.params
		const {
			name,
			surname,
			patronym,
			dateOfBirth,
			rnokpp,
			unzr,
			passportNumber,
			gender
		} = req.query
		const updatedRowsCount = await personService.updatePersonByUniqueAttribute(
			attribute,
			value,
			{
				name,
				surname,
				patronym,
				dateOfBirth,
				rnokpp,
				unzr,
				passportNumber,
				gender
			}
		)
		if (updatedRowsCount === 0) {
			logger.info(`Person not found (${attribute}): ${value}`)
			return res.status(404).json({
				error: `Person with atribute ${attribute}: ${value} not found in DB`
			})
		}
		logger.info(`Updated person by unique attribute (${attribute}): ${value}`)
		res.status(200).json('Person updated')
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			const errorMessage = error.errors.map(err => err.message).join('; ')
			logger.error(`DB Error updating person: ${errorMessage}`)
			res.status(409).json({ error: errorMessage })
		} else {
			logger.error(`Error updating person: ${error.message}`)
			res.status(500).json({ error: `Error updating person: ${error.message}` })
		}
	}
}

// Обробляє видалення особи за унікальним атрибутом. Делегує операцію функції personService.deletePersonByUniqueAttribute().
// Повертає відповідь успіху зі статусом 200, якщо успішно, або відповідь 'Person not found' зі статусом 404, якщо особа не існує, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка.
exports.deletePersonByUniqueAttribute = async (req, res) => {
	try {
		const { attribute, value } = req.params
		const deletedRowsCount = await personService.deletePersonByUniqueAttribute(
			attribute,
			value
		)
		if (deletedRowsCount === 0) {
			logger.info(
				`Delete failed. Person with atribute ${attribute}: ${value} not found in DB`
			)
			return res.status(404).json({
				error: `Delete failed. Person with atribute ${attribute}: ${value} not found in DB`
			})
		}
		logger.info(
			`Person with attribute ${attribute} = ${value} was deleted successfully.`
		)
		res
			.status(200)
			.json(
				`Person with attribute ${attribute} = ${value} was deleted successfully.`
			)
	} catch (error) {
		logger.error(`Error deleting person by unique attribute: ${error.message}`)
		res.status(500).json({ error: `Failed to delete person: ${error.message}` })
	}
}
//Обробка помилок реалізована за допомогою блоків try-catch для перехоплення можливих помилок, які можуть виникнути під час операцій з базою даних. Помилки логуються за допомогою логера, а відповідні відповіді з помилками надсилаються клієнту.

// Файл personController.js ефективно обробляє CRUD операції для осіб, делегує операції сервісу personService і виконує обробку помилок за допомогою блоків try-catch. Він має чисту та організовану структуру, що добре для підтримуваності.
