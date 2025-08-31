# CareerLink Authentication System

This document describes the authentication system implemented in the CareerLink application.

## Overview

The authentication system is built around JWT (JSON Web Tokens) and integrates with a .NET backend AuthController. It supports three user roles: Student, Employer, and Admin.

## Backend Integration

The frontend connects to the following backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/update` - Update user profile (requires authentication)
- `DELETE /api/auth/delete` - Delete user account (requires authentication)

## Frontend Implementation

### Key Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages authentication state
   - Handles JWT token storage and validation
   - Provides authentication methods to components

2. **Auth API** (`src/api/authApi.ts`)
   - Handles API calls to backend endpoints
   - Manages JWT token storage in localStorage
   - Includes token expiration checking

3. **Login Components**
   - `LoginPage.tsx` - Main login page with role selection
   - `StudentLogin.tsx` - Student login/registration form
   - `EmployerLogin.tsx` - Employer login/registration form
   - `AdminLogin.tsx` - Admin login form

4. **Registration**
   - `RegisterPage.tsx` - Dedicated registration page
   - Registration forms integrated into login components

5. **Profile Management**
   - `ProfilePage.tsx` - User profile management
   - Update profile information
   - Delete account functionality

### Authentication Flow

1. **Registration**
   - User fills out registration form with email, password, full name, and role
   - Frontend calls `/api/auth/register`
   - On success, automatically logs in the user

2. **Login**
   - User enters email and password
   - Frontend calls `/api/auth/login`
   - Backend returns JWT token and user data
   - Token is stored in localStorage
   - User is redirected to appropriate dashboard

3. **Session Management**
   - JWT token is automatically included in API requests
   - Token expiration is checked on app initialization
   - Invalid/expired tokens are cleared automatically

4. **Logout**
   - Token is removed from localStorage
   - User state is cleared
   - User is redirected to login page

### User Roles

- **Student**: Can access student dashboard and job listings
- **Employer**: Can access employer dashboard and job management
- **Admin**: Can access all dashboards and administrative functions

### Security Features

- JWT tokens for stateless authentication
- Automatic token expiration handling
- Secure token storage in localStorage
- Role-based access control
- Protected routes based on user roles

### API Configuration

The API base URL is configured in `src/utils/api.ts`:
```typescript
const API_BASE_URL = "http://localhost:5000/api";
```

Update this URL to match your backend server address.

### Error Handling

- Network errors are caught and displayed to users
- Authentication errors are handled gracefully
- Token expiration triggers automatic logout
- Form validation provides immediate feedback

### Usage Examples

```typescript
// Using the auth context
const { user, login, register, logout, updateProfile } = useAuth();

// Login
const success = await login({ email: "user@example.com", password: "password" });

// Register
const success = await register({
  email: "user@example.com",
  password: "password",
  fullName: "John Doe",
  role: "Student"
});

// Update profile
const success = await updateProfile({
  fullName: "John Smith",
  email: "newemail@example.com"
});

// Logout
logout();
```

## Setup Instructions

1. Ensure your backend server is running on the configured port
2. Update the API base URL if needed
3. Start the frontend development server
4. Navigate to `/login` or `/register` to test authentication

## Troubleshooting

- **CORS Issues**: Ensure your backend allows requests from the frontend origin
- **Token Issues**: Check that JWT configuration matches between frontend and backend
- **Role Issues**: Verify that role names match exactly ("Student", "Employer", "Admin")
- **API Errors**: Check browser network tab for detailed error messages
