# CV Manager — Redesigned CV Builder

A full-stack CV management application built with **Angular** and **ASP.NET Core Web API**.

This redesigned version extends the original CV Manager with an improved CV creation workflow, live preview, multiple CV templates, and PDF export. Users can register, log in securely, and manage their own CVs through a protected REST API.

## Features

### Authentication and Security

- User registration
- User login
- Password hashing
- JWT-based authentication
- Protected Angular routes
- JWT authorization through an HTTP interceptor
- User-specific CV access

### CV Management

- Create CVs
- View all saved CVs
- View individual CVs
- Update CVs
- Delete CVs
- Store CV content independently for each saved CV

### CV Builder

- Improved CV builder interface
- Edit personal details and professional summary
- Add multiple work experiences
- Add multiple education entries
- Manage skills, projects, and certifications
- Live CV preview while editing
- Classic and modern CV templates
- Export CVs to PDF

### Additional Features

- Swagger API documentation
- SQL Server database
- Entity Framework Core migrations

## Tech Stack

### Backend

- ASP.NET Core 5.0 Web API
- C#
- Entity Framework Core
- SQL Server
- JWT Bearer Authentication
- Swagger / OpenAPI

### Frontend

- Angular 20
- TypeScript
- HTML / CSS
- Angular Router
- Angular HTTP Client
- html2pdf.js for PDF export

### Development Environment

- Node.js 22.16.0
- npm 10.9.2
- .NET SDK 9.0.302

> The backend project targets **.NET 5.0**, which is out of support. The installed development SDK is 9.0.302.

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

## CV Content and Data Storage

Each saved CV contains its own content, which can include:

- Personal details
- Professional summary
- Work experiences
- Education
- Skills
- Projects
- Certifications

CV content is stored independently for each saved document. This allows users to customize different CVs without automatically changing the content of other saved CVs.

The CV list endpoint returns summary information, while the individual CV endpoint provides the full content needed for editing and previewing.

## Database

The application uses **SQL Server** with **Entity Framework Core**.

The database schema is managed using Entity Framework Core migrations.

To apply existing migrations to the database, run:

```bash
dotnet ef database update
```

Run this command from the backend project directory:

```text
backend/cv-manager-backend
```

If the EF Core command-line tool is not available, install it:

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

Navigate to the project directory:

```bash
cd cv-manager
```

Switch to the redesign branch:

```bash
git checkout cv-redesign
```

### 2. Start the Backend

Navigate to the backend project:

```bash
cd backend/cv-manager-backend
```

Configure the local database connection and JWT signing key before running the application.

Apply the database migrations:

```bash
dotnet ef database update
```

Start the API:

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
3. Use `POST /api/Auth/register` to create an account, or `POST /api/Auth/login` to log in.
4. Copy the JWT token returned by the login endpoint.
5. Click the **Authorize** button in the top-right corner of Swagger.
6. Enter the token and authorize.
7. Test the protected CV endpoints.

When the JWT expires, log in again to obtain a new token.

### 3. Start the Frontend

Open another terminal and navigate to the frontend project from the repository root:

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
│       │       │   ├── cv-form/
│       │       │   ├── cv-preview/
│       │       │   └── dashboard/
│       │       ├── services/
│       │       ├── guards/
│       │       └── interceptors/
│       └── package.json
│
└── README.md
```

## Future Development

Planned improvements include:

- DOCX export
- PDF/DOCX document upload and management
- Role-based authorization for administrative users
- Production deployment
- Online database and file storage

## Security Notes

Sensitive configuration values, including JWT signing keys and database credentials, should not be committed to the repository.

For local development, use appropriate local configuration or .NET User Secrets for sensitive values.

For public deployments, use environment-specific configuration and secure secret storage.

The backend currently targets .NET 5.0, which is out of support. Upgrading to a supported .NET version is recommended before production deployment.

## Status

The project includes a working Angular frontend, ASP.NET Core Web API backend, SQL Server database, JWT authentication, and authenticated CV CRUD functionality.

The redesigned CV builder supports multiple CV content sections, live preview, template selection, and PDF export.

Production deployment and additional document-management capabilities remain future improvements.
