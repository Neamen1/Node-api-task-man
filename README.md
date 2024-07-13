# Node-api-task-man



## Overview
This Node.js project implements a RESTful API for managing tasks. It allows users to perform CRUD operations (Create, Read, Update, Delete) on tasks. The application is built using Express.js and follows a modular architecture with clear separation of concerns. The project includes controllers for handling business logic, middleware for request processing, and tests to ensure the functionality of the API.

## Table of Contents
- [Installation](#Installation)
- [Usage](#Usage)
- [Endpoints](#Endpoints)
- [Project-Structure](#Project-Structure)
- [Testing](#Testing)
- [Contact](#Contact)

## Installation
1. Clone the repository:
```sh
git clone https://github.com/Neamen1/Node-api-task-man.git
```
2. Navigate to the project directory:
```sh
cd Node-api-task-man
```
3. Install dependencies:
```sh
npm install
```

## Usage 
1. Start the server:
```sh
npm start
```

2. Run tests:
```sh
npm test
```

## Endpoints
The following endpoints are available in the API:

- GET /tasks: Retrieve all tasks.
- GET /tasks/:id: Retrieve a specific task by ID.
- POST /tasks: Create a new task.
- PUT /tasks/:id: Update an existing task by ID.
- DELETE /tasks/:id: Delete a task by ID.

## Project Structure
- app.js: The main application file that sets up the Express server and middleware.
- taskController.js: Contains the logic for task-related operations such as creating, reading, updating, and deleting tasks.
- database.js: Manages the database configuration and connection setup.
- requestLogger.js: Middleware for logging incoming requests to the server.
- tasks.test.js: Contains tests for the task controller to ensure the API endpoints function correctly.
- database.test.js: Contains tests for the database to ensure db to function correctly.


## Contact
For any questions or feedback, please contact:
- [Oleksii](mailto:o.rakytskyi@gmail.com)
