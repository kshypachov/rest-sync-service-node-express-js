const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })

const doc = {
	info: {
		title: 'rest-sync-service-node-express-js',
		description: 'This Node.js Express server allows you to manage a list of people. It provides endpoints to perform CRUD operations on person records stored in the database. The server uses Sequelize as an ORM to interact with the database and has features such as input validation, logging, and error handling.'
	},
	host: ''
	
}

const outputFile = './swagger-output.json'
const routes = ['./app.js']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)
