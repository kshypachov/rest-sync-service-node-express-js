const logger = require('../middleware/logger') // Логер: Імпортується для логування за допомогою Winston.
const models = require('../models/index') // Моделі: Імпортуються для доступу до моделей Sequelize для взаємодії з базою даних.

// У Sequelize, коли ви викликаєте метод create() для моделі (у цьому випадку, моделі Person), Sequelize генерує та виконує запит SQL INSERT, щоб вставити новий запис у відповідну таблицю бази даних.
// Створює новий запис особи в базі даних за допомогою моделі Person. Отримує дані особи як параметри та вставляє їх у базу даних за допомогою методу create() Sequelize.
exports.createPerson = async personData => {
	try {
		const newPerson = await models.Person.create(personData)
		return newPerson
	} catch (error) {
		throw error
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
		return persons
	} catch (error) {
		throw error
	}
}
// Отримує кількість осіб в базі даних на основі параметрів запиту.
exports.getPersonsByQueryParametersCount = async queryParameters => {
	try {
		const totalCount = await models.Person.count({ where: queryParameters })
		return totalCount
	} catch (error) {
		throw new Error(`Error getting persons count: ${error.message}`)
	}
}

// Отримує одну особу з бази даних на основі унікального атрибуту (наприклад, ID, unzr, rnokpp, passportNumber). Створює where clause на основі атрибуту та значення і виконує запит до бази даних для пошуку особи.
exports.getPersonByUniqueAttribute = async (attribute, value) => {
	try {
		const person = await models.Person.findOne({
			where: { [attribute]: value }
		})
		return person
	} catch (error) {
		throw error
	}
}

// Оновлює особу в базі даних на основі унікального атрибуту. Створює where clause на основі атрибуту та значення, оновлює дані особи наданими новими даними і повертає оновлену особу.
exports.updatePersonByUniqueAttribute = async (
	attribute,
	value,
	updateData
) => {
	try {
		const [updatedPersons, updatedRowsCount] = await models.Person.update(
			updateData,
			{
				where: { [attribute]: value },
				returning: true
			}
		)
		return updatedRowsCount
	} catch (error) {
		console.error('Error updating persons:', error)
		throw error
	}
}

// Видаляє особу з бази даних на основі унікального атрибуту. Створює where clause на основі атрибуту та значення і видаляє відповідну особу з бази даних.
exports.deletePersonByUniqueAttribute = async (attribute, value) => {
	try {
		const deletedRowsCount = await models.Person.destroy({
			where: { [attribute]: value }
		})
		return deletedRowsCount
	} catch (error) {
		throw error
	}
}

// Кожна функція сервісу обгортає свої операції з базою даних у блок try-catch для перехоплення можливих помилок. Якщо виникає помилка, вона логує повідомлення про помилку і викидає помилку для обробки викликачем.

// Файл personService.js ефективно інкапсулює бізнес-логіку для обробки CRUD операцій з особами, взаємодіє з базою даних за допомогою моделей Sequelize і виконує обробку помилок.
