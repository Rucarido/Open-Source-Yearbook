# API Reference

The API runs at `http://localhost:8000` in local development. FastAPI also publishes interactive documentation at `/docs` and `/redoc`.

## Authentication

Protected endpoints require:

```http
Authorization: Bearer <access-token>
```

Access tokens expire after 30 minutes. There is no refresh-token flow.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/register` | No | Create a user account |
| `POST` | `/login` | No | Exchange credentials for a JWT |
| `GET` | `/yearbook` | No | List all profiles |
| `POST` | `/profile` | Yes | Create a profile for the current user |
| `GET` | `/profile/me` | Yes | List profiles owned by the current user |
| `PUT` | `/profile/{profile_id}` | Yes, owner | Update an owned profile |
| `DELETE` | `/profile/{profile_id}` | Yes, owner | Delete an owned profile |
| `POST` | `/upload` | Yes | Store a validated image and return its URL |
| `GET` | `/static/...` | No | Serve local static files |

## Request and Response Examples

### Register

```http
POST /register
Content-Type: application/json

{
  "email": "person@example.com",
  "password": "correct horse battery staple"
}
```

Passwords must be 8 to 128 characters. The endpoint returns `201 Created` with the created user's `id` and `email`. Password hashes are never returned.

### Login

`OAuth2PasswordRequestForm` expects URL-encoded fields. The email is sent in the `username` field:

```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=person%40example.com&password=correct%20horse%20battery%20staple
```

Response:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

### Create a profile

```http
POST /profile
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "full_name": "Example Person",
  "batch_year": 2025,
  "quote": "Make something useful.",
  "bio": "A short biography.",
  "social_links": {
    "github": "https://github.com/example",
    "linkedin": "https://www.linkedin.com/in/example",
    "x": "https://x.com/example"
  },
  "photo_url": "https://example.com/photo.jpg"
}
```

`full_name` and `batch_year` are required. The other fields are optional. The API returns the new MongoDB id:

```json
{
  "message": "Profile created successfully",
  "id": "<profile-object-id>"
}
```

### Upload an image

```http
POST /upload
Authorization: Bearer <jwt>
Content-Type: multipart/form-data

file=<image bytes>
```

Response:

```json
{
  "url": "http://localhost:8000/static/uploads/photo.jpg"
}
```

The endpoint requires authentication, accepts JPEG, PNG, GIF, and WebP files, verifies image bytes, limits uploads to 5 MB, limits dimensions to 4096px, and generates a server-side filename.

### Profile response shape

Profile list endpoints return objects shaped like:

```json
{
  "id": "<profile-object-id>",
  "user_id": "<user-object-id>",
  "email": "person@example.com",
  "full_name": "Example Person",
  "batch_year": 2025,
  "quote": "Make something useful.",
  "bio": "A short biography.",
  "social_links": {
    "github": "https://github.com/example"
  },
  "photo_url": "https://example.com/photo.jpg"
}
```

Optional fields may be `null`. `social_links` is an arbitrary dictionary from the backend's perspective.

## Error Behavior

- `400`: duplicate email, invalid profile id, or invalid request state.
- `401`: missing or invalid bearer token, or incorrect login credentials.
- `404`: missing user or profile, including a profile not owned by the current user.
- `422`: FastAPI/Pydantic validation error.
- `500`: unexpected upload failure or unhandled server error.

Validation errors generally have FastAPI's `detail` array format. The login screen formats array details into a comma-separated message.
