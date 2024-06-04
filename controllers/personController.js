// personController.js

const logger = require('../middleware/logger') // Імпортуємо логер для логування за допомогою Winston
const personService = require('../services/personService') // Імпортуємо personService для обробки CRUD операцій з особами

// Функції контролера:
// Обробляє створення нової особи. Делегує операцію створення функції personService.createPerson().
// Повертає новостворену особу зі статусом 201, якщо успішно, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка.
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
		res.status(500).json({ error: error.message }) // Відправлення фактичного повідомлення про помилку клієнту
	}
}

// Обробляє отримання осіб за параметрами запиту. Делегує операцію функції personService.getPersonsByQueryParameters().
// Повертає список осіб зі статусом 200, якщо успішно, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка.
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
		res.status(200).json(person)
	} catch (error) {
		logger.error(`Error getting person: ${error.message}`)
		res.status(500).json({ error: `Failed to get person:${error.message}` })
	}
}

// Обробляє оновлення особи за унікальним атрибутом. Делегує операцію функції personService.updatePersonByUniqueAttribute().
// Повертає оновлену особу зі статусом 200, якщо успішно, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка.
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
		await personService.updatePersonByUniqueAttribute(
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
		)
		res.status(200).json('Person updated')
	} catch (error) {
		logger.error(`Error updating person: ${error.message}`)
		res.status(500).json({ error: `Error updating person:${error.message}` })
	}
}

// Обробляє видалення особи за унікальним атрибутом. Делегує операцію функції personService.deletePersonByUniqueAttribute().
// Повертає відповідь успіху зі статусом 204, якщо успішно, або логує та повертає відповідь з помилкою зі статусом 500, якщо сталася помилка.
exports.deletePersonByUniqueAttribute = async (req, res) => {
	try {
		const { attribute, value } = req.params
		const result = await personService.deletePersonByUniqueAttribute(
			attribute,
			value
		)
		res.status(204).json(result) 
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
//Обробка помилок реалізована за допомогою блоків try-catch для перехоплення можливих помилок, які можуть виникнути під час операцій з базою даних. Помилки логуються за допомогою логера, а відповідні відповіді з помилками надсилаються клієнту.

// Файл personController.js ефективно обробляє CRUD операції для осіб, делегує операції сервісу personService і виконує обробку помилок за допомогою блоків try-catch. Він має чисту та організовану структуру, що добре для підтримуваності.