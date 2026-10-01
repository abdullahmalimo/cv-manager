# CV Manager

A full-stack CV management application built with **Angular** and **ASP.NET Core Web API**.

The application allows users to register, log in securely using JWT authentication, and manage their own CVs through a protected REST API.

## Features

* User registration
* User login
* Password hashing
* JWT-based authentication
* Protected Angular routes
* JWT authorization through HTTP interceptor
* Create CVs
* View CVs
* View individual CVs
* Update CVs
* Delete CVs
* User-specific CV access
* Swagger API documentation
* SQL Server database
* Entity Framework Core migrations

## Tech Stack

### Backend

* ASP.NET Core 5.0 Web API
* C#
* Entity Framework Core
* SQL Server
* JWT Bearer Authentication
* Swagger / OpenAPI

### Frontend

* Angular 20
* TypeScript
* HTML / CSS
* Angular Router
* Angular HTTP Client

### Development Environment

* Node.js 22.16.0
* npm 10.9.2
* .NET SDK 9.0.302

> The backend project targets **.NET 5.0**. The installed development SDK is 9.0.302.

## Authentication

Authentication is implemented using JSON Web Tokens (JWT).

The authentication flow is:

1. A user registers an account.
2. The user logs in using their email and password.
3. The backend verifies the password and generates a JWT.
4. The Angular application stores the token locally.
5. An HTTP interceptor automatically adds the token to API requests.
6. Protected routes require authentication.
7. The backend extracts the authenticated user's ID from the JWT.
8. CV operations are restricted to the authenticated user's CVs.

The backend does **not** rely on the frontend to provide the user's `UserId` when creating a CV. The user ID is obtained from the authenticated JWT instead.

## API

The backend exposes REST endpoints for authentication and CV management.

### Authentication

```text
POST /api/Auth/register
POST /api/Auth/login
```

### CV Management

```text
GET    /api/CV
GET    /api/CV/{id}
POST   /api/CV
PUT    /api/CV/{id}
DELETE /api/CV/{id}
```

CV endpoints require authentication.

Users can only access CVs associated with their authenticated account.

## Database

The application uses **SQL Server** with **Entity Framework Core**.

The database schema is managed using Entity Framework Core migrations.

To apply existing migrations to the database:

```bash
dotnet ef database update
```

From the backend project directory:

```text
backend/cv-manager-backend
```

If the EF Core command is not available, install the EF Core command-line tool:

```bash
dotnet tool install --global dotnet-ef
```

The database connection is configured through `appsettings.json`.

For security, connection strings and JWT secrets containing sensitive values should not be committed to a public repository.

## Running the Application

### 1. Clone the repository

```bash
git clone https://github.com/abdullahmalimo/cv-manager.git
```

```bash
cd cv-manager
```

### 2. Start the Backend

Navigate to the backend project:

```bash
cd backend/cv-manager-backend
```

Apply the database migrations:

```bash
dotnet ef database update
```

Run the API:

```bash
dotnet run
```

The API is available locally at:

```text
https://localhost:5001
http://localhost:5000
```

Swagger is available at:

```text
https://localhost:5001/swagger
```
#### Using Swagger

Most CV API endpoints require authentication.

1. Start the backend.
2. Open Swagger at `https://localhost:5001/swagger`.
3. Use `POST /api/Auth/login` to log in.
4. Copy the JWT token returned by the login endpoint.
5. Click the **Authorize** button in the top-right corner of Swagger.
6. Enter the token.
7. Click Authorize.
8. You can now test the protected CV endpoints.
```text

### 3. Start the Frontend

Open another terminal and navigate to:

```bash
cd frontend/cv-manager-frontend
```

Install the dependencies:

```bash
npm install
```

Start Angular:

```bash
ng serve
```

The frontend will be available at:

```text
http://localhost:4200
```

## Project Structure

```text
CVManager/
│
├── backend/
│   └── cv-manager-backend/
│       ├── Controllers/
│       ├── Models/
│       ├── Data/
│       ├── DTOs/
│       ├── Migrations/
│       ├── Program.cs
│       ├── Startup.cs
│       └── appsettings.json
│
├── frontend/
│   └── cv-manager-frontend/
│       ├── src/
│       │   └── app/
│       │       ├── components/
│       │       ├── services/
│       │       ├── guards/
│       │       └── interceptors/
│       └── package.json
│
└── README.md
```

## Current CV Data

The current version of the application stores CV information using related entities for:

* CV
* Personal information
* Experience information
* User accounts

The CV model is being expanded toward a more complete CV builder containing sections such as:

* Professional summary
* Multiple work experiences
* Education
* Skills
* Projects
* Certifications

## Future Development

Planned improvements include:

* DTO-based CV API structure
* Expanded CV structure with multiple experiences, education entries, skills, projects and certifications
* CV PDF generation
* PDF/DOCX document upload and management
* Improved CV builder interface
* CV templates
* Role-based authorization for administrative users
* Production deployment
* Online database and file storage

## Security Notes

Sensitive configuration values such as:

* Database connection strings
* JWT signing keys

should be stored securely and should not be committed to the repository.

For public deployments, environment-specific configuration and secure secret storage should be used.

## Status

The project currently has a working Angular frontend, ASP.NET Core Web API backend, SQL Server database, JWT authentication, and authenticated CV CRUD functionality.
