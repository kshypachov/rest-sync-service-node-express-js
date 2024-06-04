
  

# REST Node js Express js Person Data Management Service

  

This is a simple REST API built with Node.js and Express.

  

## Description

  

This is a Node.js Express server that manages a list of persons. It provides RESTful APIs to create, read, update, and delete person records in a database. The server uses Sequelize as the ORM for database interactions and supports input validation, logging, and error handling.

  

## Installation

  

1. Clone the repository:

  

```bash

git  clone  https://github.com/roman-lakhnov/rest-node-js

```

  

2. Install dependencies:

  

```bash

cd  rest-node-js

  

npm  install

```

## Usage

  

### Starting the Server

  

To start the server in production mode, run:

  

```bash

npm  start

```

To run the server in development mode with nodemon (automatically restarts on file changes), run:

  

```bash

npm  run  dev

```

  

## Endpoints

  

### Create a Person

  

**URL:**  `/person`

**Method:**  `POST`

**Body:**

  

```bash
{

"name": "John",

"surname": "Doe",

"patronym": "Smith",

"dateofbirth": "1990-01-01",

"rnokpp": "1234567890",

"unzr": "12345678901234",

"passportNumber": "AB1234567",

"sex": "male"

}
```
  

**Response:**
```bash
{

"id": 1,

"name": "John",

"surname": "Doe",

"patronym": "Smith",

"dateofbirth": "1990-01-01",

"rnokpp": "1234567890",

"unzr": "12345678901234",

"passportNumber": "AB1234567",

"sex": "male",

"createdAt": "2024-05-23T11:40:25.000Z",

"updatedAt": "2024-05-23T11:40:25.000Z"

}
```
  

### Get Persons by Query Parameters

**URL:** `/person`

**Method:** `GET`

**Query Parameters:** (Any combination of person attributes)

**Response:**

  
```bash
[

{

"id": 1,

"name": "John",

"surname": "Doe",

"patronym": "Smith",

"dateofbirth": "1990-01-01",

"rnokpp": "1234567890",

"unzr": "12345678901234",

"passportNumber": "AB1234567",

"sex": "male",

"createdAt": "2024-05-23T11:40:25.000Z",

"updatedAt": "2024-05-23T11:40:25.000Z"

}
]
```
  

###Get Person by Unique Attribute

**URL:** `/person/:attribute/:value`

**Method:** `GET`

**Response:**
```bash
{

"id": 1,

"name": "John",

"surname": "Doe",

"patronym": "Smith",

"dateofbirth": "1990-01-01",

"rnokpp": "1234567890",

"unzr": "12345678901234",

"passportNumber": "AB1234567",

"sex": "male",

"createdAt": "2024-05-23T11:40:25.000Z",

"updatedAt": "2024-05-23T11:40:25.000Z"

}
```
  

### Update Person by Unique Attribute

**URL:** `/person/:attribute/:value`

**Method:** `PUT`

**Body:** (Any combination of person attributes)

**Response:**
```bash
{

"Person updated"

}
```
  

### Delete Person by Unique Attribute

**URL**: `/person/:attribute/:value`

**Method:**`DELETE`

**Response:** 204 No Content

  

### Examples of Usage

Assuming the server is running locally on port 3000:

**cURL**

**Create a Person:**
```  bash
curl -X POST http://localhost:3000/person -H "Content-Type: application/json" -d '{

"name": "John",

"surname": "Doe",

"patronym": "Smith",

"dateofbirth": "1990-01-01",

"rnokpp": "1234567890",

"unzr": "12345678901234",

"passportNumber": "AB1234567",

"sex": "male"

}'
```

**Get Persons by Query Parameters:**
```bash
curl http://localhost:3000/person?name=John
```
  

**Get Person by Unique Attribute:**

  
```bash
curl http://localhost:3000/person/rnokpp/1234567890
```
  

**Update Person by Unique Attribute:**

  
```bash
curl -X PUT http://localhost:3000/person/rnokpp/1234567890 -H "Content-Type: application/json" -d '{

"surname": "Smith"

}'
```
  

**Delete Person by Unique Attribute:**

  
```bash
curl -X DELETE http://localhost:3000/person/rnokpp/1234567890
```
  
### Dependencies

- express: Fast, unopinionated, minimalist web framework for Node.js.

- sequelize: Promise-based Node.js ORM.

- winston: A logger for just about everything.

- express-validator: Express middleware for validation.

- morgan: HTTP request logger middleware for Node.js.

- dotenv: Loads environment variables from a .env file into process.env.

- helmet: Helps secure Express apps by setting various HTTP headers.

- body-parser: Node.js body parsing middleware.

- cors: Node.js CORS middleware.

  
## License

**This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.**