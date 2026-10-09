# Architecture

## System Overview

The project is split into two independently started processes:

```text
Browser
  |
  | HTTP requests from React
  v
React app :3000  --------------------->  FastAPI :8000
                                            |
                                            +--> MongoDB
                                            |
                                            +--> backend/static/uploads
```

The browser owns the presentation state and stores the JWT in `localStorage`. FastAPI owns authentication, authorization, validation, persistence, and file serving. MongoDB stores users and profiles; uploaded images are not stored in MongoDB, only their returned URL is stored in a profile document.

## Frontend Structure

The frontend is a Create React App application under `frontend/yearbook-frontend`.

- `src/App.js` defines the two routes: `/` for authentication and `/yearbook` for the protected yearbook screen.
- `src/pages/Login.jsx` switches between registration and login and sends requests with Axios.
- `src/pages/Yearbook.jsx` loads public profiles and the current user's profiles, then coordinates modals and refreshes.
- `src/components/AuthForm.jsx` owns the email/password form.
- `src/components/ProtectedRoute.jsx` performs the client-side token presence check.
- `src/components/EditProfileForm.jsx` handles create, update, delete, and image upload operations.
- `src/components/ProfileCard.jsx` renders a compact profile preview.
- `src/components/ProfileModal.jsx` renders a selected profile in detail.
- `src/components/StarryBackground.jsx` and `src/components/Background3D.jsx` provide decorative visual layers.

The app currently uses both Axios and the native Fetch API. API URLs are repeated as `http://localhost:8000` literals instead of being centralized in a client module.

## Backend Structure

The backend is a small FastAPI application under `backend`.

- `main.py` creates the app, configures CORS, mounts `/static`, and defines all routes.
- `models.py` defines Pydantic models for user and profile input/output.
- `database.py` creates one PyMongo client and exposes the `users` and `profiles` collections.
- `auth.py` hashes passwords, creates JWTs, and provides the `get_current_user` dependency.

The current backend is intentionally flat. This makes the project easy to understand, but route handlers currently contain database access, serialization, and business rules together. A larger version should split routers, services, repositories, and schemas.

## Request Flows

### Registration and login

1. The registration form posts JSON to `POST /register`.
2. The API validates the email, hashes the password with bcrypt, and inserts a user document.
3. The login form posts URL-encoded credentials to `POST /login` using `username` for the email field, as required by `OAuth2PasswordRequestForm`.
4. The API signs a JWT containing the user's email in the `sub` claim.
5. The frontend stores the access token as `localStorage.token`.
6. Protected requests send `Authorization: Bearer <token>`.

### Profile creation and ownership

1. `get_current_user` decodes the JWT and loads the user by email.
2. `POST /profile` derives `user_id` and `email` from the authenticated user rather than trusting the request body.
3. Update and delete operations require both the profile ObjectId and the authenticated user's email to match.
4. `GET /yearbook` returns all profile documents for the public yearbook view.

### Image upload

1. The profile form sends a multipart request to `POST /upload`.
2. The API checks that the declared content type starts with `image/`.
3. The file is written to `backend/static/uploads`.
4. The API returns a URL such as `http://localhost:8000/static/uploads/<filename>`.
5. The profile stores that URL in `photo_url`.

## Data Model

MongoDB documents are schemaless, but the application expects these shapes:

`users`:

```json
{
  "_id": "ObjectId",
  "email": "person@example.com",
  "hashed_password": "bcrypt hash"
}
```

`profiles`:

```json
{
  "_id": "ObjectId",
  "user_id": "string form of users._id",
  "email": "owner@example.com",
  "full_name": "Example Person",
  "batch_year": 2025,
  "quote": "Optional quote",
  "bio": "Optional biography",
  "social_links": {
    "linkedin": "https://www.linkedin.com/in/example",
    "github": "https://github.com/example",
    "x": "https://x.com/example"
  },
  "photo_url": "https://example.com/photo.jpg"
}
```

The API converts MongoDB `_id` to a string `id` in responses. Profile ownership is currently checked by email, while both `user_id` and `email` are stored redundantly.

## Architectural Follow-ups

- Centralize the frontend API base URL and request/auth error handling.
- Add a backend router/service/repository split as features grow.
- Add MongoDB indexes on `users.email`, `profiles.email`, and any future query fields.
- Add pagination and filtering to `GET /yearbook`.
- Move image storage to object storage and store stable HTTPS URLs.
- Add integration tests around auth, ownership, and upload validation.
