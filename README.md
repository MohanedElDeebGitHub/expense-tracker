# Personal Expense Tracker

This is a full-stack web application I developed to provide a straightforward way for users to track their personal expenses. The project uses a MERN-like stack, substituting MongoDB with MySQL and Sequelize ORM, and features JWT for secure authentication.

## Features

-   **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens). Passwords are securely hashed using bcrypt.
-   **Expense Management (CRUD):**
    -   Add new expenses with amount, category, date, and an optional description.
    -   View a list of all personal expenses.
    -   Edit existing expense details.
    -   Delete expenses.
-   **Filtering:**
    -   Filter expenses by category.
    -   Filter expenses by a specific date range (start date to end date).
    -   Filter expenses by month and year.
-   **Reporting:**
    -   View a summary report of expenses, including total expenses and a breakdown by category for the filtered period.
-   **Dashboard Interface:** A user-friendly dashboard to manage and view expenses.
-   **Responsive Design:** Basic responsiveness for usability on different screen sizes.

## Design Approaches

As the developer (MohanedElDeebGitHub), I approached this project with the following design considerations:

**1. Overall Architecture:**
   - I chose a **separated frontend and backend** architecture. This promotes modularity and allows for independent development and scaling if needed.
   - The **backend is a Node.js/Express.js RESTful API** serving JSON data.
   - The **frontend is a React single-page application (SPA)** that consumes the backend API.

**2. Backend Design (Node.js/Express.js & Sequelize):**
   - I structured the backend following a pattern similar to **Model-View-Controller (MVC)**:
     - **Models (`models/`):** Defined using Sequelize to represent database tables (`User`, `Expense`) and manage interactions with the MySQL database.
     - **Controllers (`controllers/`):** Contain the business logic for handling requests (e.g., user registration, expense creation).
     - **Routes (`routes/`):** Define the API endpoints and map them to controller functions.
   - **Authentication:** Implemented using **JSON Web Tokens (JWT)**. Upon login, a token is generated and sent to the client. This token is then required for accessing protected routes.
   - **Middleware (`middleware/authMiddleware.js`):** Used to protect routes by verifying the JWT.
   - **Error Handling:** Basic error handling is in place to send appropriate HTTP status codes and error messages to the client.
   - **Database Interaction:** Sequelize ORM simplifies database queries, migrations (though used manually here via SQL script for simplicity), and model definitions.

**3. Frontend Design (React):**
   - **Component-Based Architecture:** The UI is built with reusable React components (e.g., `ExpenseForm`, `ExpenseList`, `Navbar`).
   - **Routing:** `react-router-dom` is used for client-side navigation, enabling a SPA experience.
   - **State Management:**
     - For global state like user authentication status, I utilized React's **Context API (`AuthContext`)**.
     - Component-level state (`useState`) is used for managing local UI state (e.g., form inputs, loading states for specific components).
   - **API Interaction:** A dedicated **service layer (`services/`)** using `axios` centralizes API calls, making components cleaner and API logic easier to manage.
   - **Styling:** Custom CSS is used for styling, focusing on clarity and a clean user interface. Basic responsive design principles are applied to ensure usability across different device sizes.

**4. UI/UX:**
   - The primary goal was to create an **intuitive and easy-to-use interface**.
   - Standard patterns like forms for input, lists for display, and clear navigation are employed.
   - Feedback mechanisms like loading states and error messages are provided to the user.

## Database Design

The database is designed with MySQL and consists of two main tables: `users` and `expenses`.

**1. `users` Table:**
   - `userid` (INT, AUTO_INCREMENT, PRIMARY KEY): Unique identifier for each user.
   - `name` (VARCHAR): User's full name.
   - `accname` (VARCHAR, UNIQUE): User's account name (username), must be unique.
   - `accpassword` (VARCHAR): Stores the hashed password (using bcrypt).
   - `createdAt`, `updatedAt` (DATETIME): Timestamps for record creation and updates.

**2. `expenses` Table:**
   - `expenseid` (INT, AUTO_INCREMENT, PRIMARY KEY): Unique identifier for each expense.
   - `amount` (DECIMAL(10, 2)): The monetary value of the expense.
   - `category` (VARCHAR): Category of the expense (e.g., "Groceries", "Utilities").
   - `userid` (INT, FOREIGN KEY): References `userid` in the `users` table, linking the expense to a user.
   - `description` (TEXT): Optional detailed description of the expense.
   - `date` (DATE): The date the expense occurred.
   - `createdAt`, `updatedAt` (DATETIME): Timestamps.

**Relationships & Constraints:**
   - There is a **one-to-many relationship** between `users` and `expenses` (one user can have many expenses).
   - The `userid` in the `expenses` table is a foreign key that references the `users` table.
   - **`ON DELETE CASCADE`** is set on the `userid` foreign key in the `expenses` table. This means if a user is deleted, all their associated expenses will also be automatically deleted, ensuring data integrity.

**Indexes:**
   - To optimize query performance, particularly for filtering and sorting expenses, the following indexes are created on the `expenses` table:
     - `idx_expenses_category_date` on (`category`, `date`)
     - `idx_expenses_category` on (`category`)
     - `idx_expenses_date` on (`date`)
     - `idx_expenses_amount` on (`amount`)
   - The `users` table has an implicit index on `userid` (as it's the PK) and a unique index on `accname`.

## Tech Stack

**Backend:**
-   Node.js, Express.js, Sequelize, MySQL, JWT, bcryptjs, dotenv, cors.

**Frontend:**
-   React, React Router DOM, Axios, CSS3.

**Database:**
-   MySQL.

## Project Structure

```
expense-tracker-app/
├── backend/
│   ├── config/database.js
│   ├── controllers/authController.js, expenseController.js
│   ├── middleware/authMiddleware.js
│   ├── models/User.js, Expense.js
│   ├── routes/authRoutes.js, expenseRoutes.js
│   ├── .env                # (Example in README, actual file gitignored)
│   └── server.js
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/AuthContext.js
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .env                # (Example in README, actual file gitignored)
│   └── package.json
├── .gitignore
├── package.json            # For concurrently script
└── README.md
```

## Replicating the Runtime Environment (Setup)

To get this project up and running locally, follow these steps:

**Prerequisites:**
-   Node.js (v14 or newer recommended)
-   npm (comes with Node.js)
-   MySQL server (XAMPP is a good option for local development as it bundles MySQL, Apache, and phpMyAdmin).
-   Git.

**1. Clone the Repository:**
   ```bash
   git clone <your-repository-url> # Replace with your actual GitHub repo URL
   cd expense-tracker-app
   ```

**2. Backend Setup:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory. You can copy the structure from the example below and fill in your details:
     ```env
     # backend/.env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password # Leave blank if XAMPP default root user has no password
     DB_NAME=personal_expense_tracker
     JWT_SECRET=your_very_strong_and_secret_jwt_key
     PORT=5000
     ```
   - **Database Creation & Schema:**
     1.  Start your MySQL server (e.g., from XAMPP Control Panel).
     2.  Using a MySQL client like phpMyAdmin (usually `http://localhost/phpmyadmin/`):
         -   Create a new database. I used the name `personal_expense_tracker`.
         -   Select the database and go to the "SQL" tab.
         -   Execute the following SQL commands to create the necessary tables and indexes:
             ```sql
             CREATE TABLE `users` (
               `userid` INT AUTO_INCREMENT PRIMARY KEY,
               `name` VARCHAR(255) NOT NULL,
               `accname` VARCHAR(255) NOT NULL UNIQUE,
               `accpassword` VARCHAR(255) NOT NULL,
               `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
               `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
             );

             CREATE TABLE `expenses` (
               `expenseid` INT AUTO_INCREMENT PRIMARY KEY,
               `amount` DECIMAL(10, 2) NOT NULL,
               `category` VARCHAR(255) NOT NULL,
               `userid` INT NOT NULL,
               `description` TEXT,
               `date` DATE NOT NULL,
               `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
               `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE CASCADE
             );

             CREATE INDEX idx_expenses_category_date ON `expenses` (`category`, `date`);
             CREATE INDEX idx_expenses_category ON `expenses` (`category`);
             CREATE INDEX idx_expenses_date ON `expenses` (`date`);
             CREATE INDEX idx_expenses_amount ON `expenses` (`amount`);
             ```

**3. Frontend Setup:**
   - From the project root, navigate to the frontend directory:
     ```bash
     cd ../frontend
     # Or if you are in backend/: cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - (Optional) The frontend is configured to connect to the backend at `http://localhost:5000/api` by default. If your backend runs on a different URL, create a `.env` file in the `frontend` directory:
     ```env
     # frontend/.env
     REACT_APP_API_URL=http://your_backend_api_url
     ```

**4. Running the Application:**
   - **Start Backend Server:**
     - In a terminal, navigate to `backend/` and run:
       ```bash
       npm run server
       ```
     - It should typically run on `http://localhost:5000`.
   - **Start Frontend Server:**
     - In a *new* terminal, navigate to `frontend/` and run:
       ```bash
       npm start
       ```
     - This will open the application in your browser, usually at `http://localhost:3000`.
   - **Running Both Concurrently:**
     - From the project root (`expense-tracker-app/`), ensure `concurrently` is installed (it's in the root `package.json`):
       ```bash
       npm install
       ```
     - Then run:
       ```bash
       npm run dev
       ```
     - This command starts both backend and frontend servers.

## API Endpoints

**Auth Routes (`/api/auth`)**
-   `POST /register`: Register a new user.
-   `POST /login`: Login an existing user.
-   `GET /me`: Get current logged-in user's details (Protected).

**Expense Routes (`/api/expenses`)** (All Protected)
-   `GET /`: Get all expenses for the logged-in user.
    -   Query params for filtering: `category`, `startDate`, `endDate`, `month`, `year`.
-   `POST /`: Add a new expense.
-   `PUT /:id`: Update an existing expense by its ID.
-   `DELETE /:id`: Delete an expense by its ID.

## Deployment Notes (e.g., Vercel)

-   **Backend:** To deploy the backend to a platform like Vercel, you would need a cloud-hosted MySQL database (XAMPP is local only). Environment variables for database connection and JWT secret must be configured on the hosting platform.
-   **Frontend:** React apps deploy well to Vercel. The `REACT_APP_API_URL` environment variable would need to be set to the deployed backend's URL.
-   For a monorepo structure like this, Vercel might require specific configuration (e.g., via `vercel.json`) or deploying frontend and backend as separate projects.

