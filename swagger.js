const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })

const doc = {
	info: {
		title: 'rest-sync-service-node-express-js',
		description: 'Description'
	},
	servers: [
		{
			url: 'http://localhost:3000',
			description: 'Localhost server',
	},
	{
			url: 'http://10.0.20.10:3000',
			description: 'External IP server',
	}
	]
}

const outputFile = './swagger-output.json'
const routes = ['./app.js']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)
