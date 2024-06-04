// initializeDb.js

const sqlite3 = require('sqlite3').verbose();

// Function to initialize the database and create tables
function initializeDatabase() {
  const db = new sqlite3.Database('mydb.sqlite');

  // Create users table
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error initializing database:', err.message);
      } else {
        console.log('Database initialized successfully');
      }
    });
  });

  // Close the database connection after initialization
  db.close();
}

// Initialize the database
initializeDatabase();

/*Database Initialization File (initializeDb.js):
This file is responsible for setting up the database connection and initializing the database schema (creating tables, defining table structures, etc.).
It's a one-time setup script that should be run to create the necessary tables and set up the database environment.
It's common to define the database schema (table structures) in this file, as it's closely related to database setup and initialization.
User Model File (userModel.js):
This file defines the structure of the User model, representing how user data is structured and stored in the database.
It typically contains a class or object that represents a user entity, including properties such as id, name, email, password, etc.
The User model file should not interact directly with the database. Instead, it serves as a blueprint for creating and manipulating user objects.
User Service File (userService.js):
This file contains functions and logic related to user operations, such as CRUD (Create, Read, Update, Delete) operations, validation, business logic, etc.
It interacts with the database (through an ORM like Sequelize or directly using SQLite3) to perform operations such as creating users, fetching user data, updating user information, deleting users, etc.
The User service file orchestrates interactions between the User model (for defining user structure) and the database (for storing and retrieving user data).
With this organization, you can keep the responsibilities of each component separate:

Database Initialization File: Responsible for setting up the database schema.
User Model File: Defines the structure of the User model.
User Service File: Handles business logic and interacts with the database to perform user-related operations.*/