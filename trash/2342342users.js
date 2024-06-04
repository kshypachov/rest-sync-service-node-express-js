// routes/users.js

const express = require('express')
const router = express.Router()
const usersController = require('./13123usersController')

// Route to get all users
router.get('/', usersController.getAllUsers)

// Route to create a new user
router.post('/', usersController.createUser)

// Route to get a user by ID
router.get('/:id', usersController.getUserById)

// Route to delete a user by ID
router.delete('/:id', usersController.deleteUserById)

module.exports = router

//We import the usersController module to handle user-related operations.
//We define routes for handling GET, POST, and DELETE requests to /, /, /:id respectively.
//Each route delegates the corresponding operation to the appropriate controller function in usersController.
