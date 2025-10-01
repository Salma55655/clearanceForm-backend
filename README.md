# Digital Student Clearance System - Backend

This folder contains the Express.js backend for the application. It uses Mongoose to connect to a MongoDB database and provides a REST API for the frontend.

## Setup Instructions

1.  **Install Dependencies:**
    Navigate to this directory in your terminal and run:
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in this `backend` directory. You can copy the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and replace `your_mongodb_connection_string_here` with your actual MongoDB connection URI.

3.  **Seed the Database:**
    To populate the database with the initial set of students, staff, and items, run the seed script. **You only need to do this once.**
    ```bash
    npm run seed
    ```

4.  **Start the Server:**
    To run the server in development mode (with automatic restarts on file changes), use:
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (default is `5000`).

## API Endpoints

The API is structured to mirror the functionality of the original `mockApiService`. The base URL will be `http://localhost:5000/api`.

-   `POST /api/auth/login` - Authenticate a user.
-   `POST /api/auth/recover` - Recover a user's password.
-   `GET /api/students` - Get all students.
-   `GET /api/students/:id` - Get a single student by their ID.
-   `PUT /api/students/:id` - Update a student's data.
-   `POST /api/students` - Create a new student.
-   `POST /api/actions/issue-items` - Issue items to students.
-   `DELETE /api/actions/remove-item/:studentId/:itemId` - Remove an item from a student.
-   `GET /api/actions/issuable-items` - Get all issuable books and items.
-   `GET /api/logs` - Get all system activity logs.
-   `POST /api/logs` - Create a new log entry.