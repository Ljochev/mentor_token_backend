Mentor Token Backend

This repository hosts the backend server for the Mentor Token application, built using Node.js and Express.js. It provides RESTful APIs to handle user authentication, job postings, mentor applications, and more.

Features

	•	User authentication (registration, login, and password reset)
	•	JWT-based protected routes
	•	CRUD operations for job postings
	•	Mentor and company-specific functionalities
	•	Contact message handling
	•	Role-based access for mentors and companies

Technologies

	•	Node.js
	•	Express.js
	•	MongoDB (using Mongoose for database interactions)
	•	dotenv (for environment variable management)
	•	cors (for cross-origin resource sharing)
	•	jsonwebtoken (for JWT-based authentication)
	•	EJS (for template rendering)

    Getting Started

To set up the project locally, follow these steps:

Prerequisites

Ensure you have Node.js and npm installed. You will also need MongoDB running locally or have a connection URI to a MongoDB database.

Installation

	1.	Clone the repository:
git clone https://github.com/your-username/mentor-token-backend.git
cd mentor-token-backend

	2.	Install dependencies:
    npm install

    Environment Variables

Create a .env file in the root of your project and set the following environment variables:
Contact me at ljochev@gmail.com for variables

Running the Server

To start the development server:
npm run dev

API Endpoints

Public Endpoints

	•	POST /api/user/register: Register a new user.
	•	POST /api/user/login: User login.
	•	POST /api/user/checkEmail: Check if an email is registered.
	•	POST /api/user/passwordResetLink: Send a password reset link.
	•	GET /api/user/checkResetToken/:resetToken: Validate a password reset token.
	•	PUT /api/user/resetPassword/:resetToken: Reset a user password.

Protected Endpoints (JWT required)

	•	GET /api/user: Get user profile.
	•	PUT /api/user: Update user profile.
	•	GET /api/user/mentors: Get a list of all mentors.
	•	GET /api/user/companies: Get a list of all companies.
	•	POST /api/job: Create a job posting.
	•	GET /api/job/allCompanies: List all open jobs by companies.
	•	And more…

    