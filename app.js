const express = require('express') // Імпортуємо фреймворк Express
const morgan = require('morgan') // Middleware для логування запитів HTTP
const logger = require('./middleware/logger') // Наш власний middleware для логування
const helmet = require('helmet') // Helmet для налаштування заголовків безпеки HTTP
const bodyParser = require('body-parser') // body-parser для аналізу JSON запитів
const cors = require('cors') // CORS для налаштування крос-доменного доступу
const router = express.Router() // Створення екземпляра маршрутизатора
const swaggerUi = require('swagger-ui-express') // Swagger UI для візуалізації API
const swaggerDocument = require('./swagger-output.json') // Шлях до сгенерованого JSON файлу Swagger
const app = express() // Створення екземпляра Express-додатку

// Налаштування Middleware

// Middleware для додавання заголовка Access-Control-Expose-Headers
app.use(function (req, res, next) {
	res.header('Access-Control-Expose-Headers', 'X-Total-Count') // Додаємо заголовок 'X-Total-Count' до відповіді
	next() // Передаємо управління наступному middleware
})

// Налаштування CORS для дозволу запитів з усіх джерел (origin: true)
app.use(
	cors({
		origin: true
	})
)

app.use(helmet()) // Використання middleware Helmet для налаштування різних заголовків безпеки HTTP
app.use(bodyParser.json()) // Використання middleware bodyParser для аналізу вхідних JSON запитів

// Налаштування Morgan для використання Winston для логування
app.use(
	morgan('combined', {
		stream: {
			write: message => logger.info(message.trim()) // Запис повідомлень логування за допомогою logger
		}
	})
)

// Налаштування маршрутів

// Обслуговування Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)) // Обслуговування Swagger UI на шляху /api-docs
// Імпорт маршрутов
const personRouter = require('./routes/person') // Імпорт маршрутизатора для роботи з person
// Використання маршрутов
app.use('/person', personRouter) // Підключення маршрутизатора person для запитів до URL /person

// Middleware для обробки помилок
app.use((err, req, res, next) => {
	logger.error(err.stack) // Логування стеку помилки
	res.status(500).send('Something broke!') // Відправлення відповіді з кодом 500
})

module.exports = app // Експорт додатку Express

// middleware
// У контексті Node.js та Express, middleware функції мають доступ до об'єктів запиту (req) та відповіді (res),
// і можуть виконувати завдання такі як логування, автентифікація, аналіз даних, обробка помилок та інше.

