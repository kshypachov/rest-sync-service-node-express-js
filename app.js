const express = require('express') // Імпортуємо фреймворк Express
const morgan = require('morgan') // Middleware для логування запитів HTTP
const logger = require('./middleware/logger') // Наш власний middleware для логування
const helmet = require('helmet') // Helmet для налаштування заголовків безпеки HTTP
const bodyParser = require('body-parser') // body-parser для аналізу JSON запитів
const router = express.Router() // Створення екземпляра маршрутизатора
const swaggerUi = require('swagger-ui-express') // Swagger UI для візуалізації API
const swaggerDocument = require('./swagger-output.json') // Шлях до сгенерованого JSON файлу Swagger
const app = express() // Створення екземпляра Express-додатку\
const cors = require('cors');


// Налаштування Middleware

// Використання middleware Helmet для налаштування різних заголовків безпеки HTTP
helmet({ contentSecurityPolicy: process.env.СONTENT_SECURITY_POLICY, }) // contentSecurityPolicy цей хедер відповідає в тому числі на можливість доступу до документації SWAGGER по зовнішній адресі.
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
	logger.error(`Error in app: ${err.message}`, { stack: err.stack }) // Логування стеку помилки
	res.status(500).send('Внутрішня помилка сервера') // Відправлення відповіді з кодом 500
})

module.exports = app // Експорт додатку Express

// middleware
// У контексті Node.js та Express, middleware функції мають доступ до об'єктів запиту (req) та відповіді (res),
// і можуть виконувати завдання такі як логування, автентифікація, аналіз даних, обробка помилок та інше.
