// routes/home.js

//Router: Handles routing within the server, mapping incoming requests to the appropriate handlers (controllers).

const express = require('express') //Express: Required to create an instance of the router.
const router = express.Router() // Creation of an instance of the Express router using express.Router()

// Define route handler function for GET "/"endpoint.
router.get('/', (req, res) => {
	const header = req.get('uxp-transaction-id')
	const headera = req.get('queryId')
	console.log(headera)

	console.log(header)
	res.send(`hello. its home endpoint   ${header}`)
})

module.exports = router //Export of the router instance, making it available for use in other parts of the application.
