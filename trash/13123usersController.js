// usersController.js

const userService = require('./34234usersService')

// Controller function to handle creating a new user
exports.createUser = async (req, res) => {
	try {
		const { name, email, password } = req.body
		const newUser = await userService.createUser(name, email, password)
		res.status(201).json(newUser)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Controller function to handle retrieving a user by ID
exports.getUserById = async (req, res) => {
	try {
		const userId = req.params.id
		const user = await userService.getUserById(userId)
		if (!user) {
			res.status(404).json({ message: 'User not found' })
		} else {
			res.status(200).json(user)
		}
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Controller function to handle retrieving all users
exports.getAllUsers = async (req, res) => {
	try {
		const users = await userService.getAllUsers()
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Controller function to handle deleting a user by ID
exports.deleteUserById = async (req, res) => {
	try {
		const userId = req.params.id
		const result = await userService.deleteUserById(userId)
		if (result.rowsAffected === 0) {
			res.status(404).json({ message: 'User not found' })
		} else {
			res.status(200).json({ message: 'User deleted successfully' })
		}
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

//Controller: Contains the application logic for processing requests and generating responses. Controllers typically interact with services to perform business logic tasks.

//We import the userService module to utilize its functions for CRUD operations on users.
//Each controller function handles a specific HTTP request and delegates the corresponding operation to the userService.
//Error handling is implemented using try-catch blocks to catch any potential errors that may occur during database operations.
