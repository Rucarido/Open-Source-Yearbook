# Open Source Yearbook

Open Source Yearbook is a full-stack digital yearbook for collecting and browsing community profiles. Authenticated users can create multiple profiles, add a photo and social links, and edit or delete profiles they own. Visitors can browse profile cards and open a detailed profile view.

This repository is currently a small development-stage application rather than a production deployment. The implementation and known limitations are documented below so contributors can run it locally and improve it safely.

## What It Provides

- React single-page interface with login, registration, profile management, and a responsive yearbook grid.
- FastAPI service for authentication, profile CRUD, image uploads, and static file serving.
- MongoDB persistence for users and profiles.
- JWT bearer authentication with bcrypt password hashing.
- CSS-only visual effects, including the starry login background and animated yearbook background.

## Stack

| Layer | Technology |
| --- | --- |
| Client | React 19, React Router, Axios, Fetch API |
| Styling | Tailwind CSS 3, PostCSS, custom CSS-in-JSX |
| API | Python, FastAPI, Uvicorn |
| Authentication | JWT (`python-jose`), bcrypt (`passlib`) |
| Database | MongoDB via PyMongo |
| Uploads | FastAPI `UploadFile`, local `backend/static/uploads` storage |

## Repository Layout

```text
.
├── backend/
│   ├── auth.py             # Password hashing, JWT creation, current-user dependency
│   ├── database.py         # MongoDB client and collection handles
│   ├── main.py             # FastAPI application and HTTP endpoints
│   ├── models.py            # Pydantic request and response models
│   ├── requirements.txt     # Python dependencies
│   └── static/uploads/      # Local uploaded files
├── frontend/yearbook-frontend/
│   ├── public/              # CRA HTML and manifest assets
│   ├── src/pages/           # Login and yearbook screens
│   ├── src/components/      # Forms, cards, modals, route guard, backgrounds
│   ├── package.json         # JavaScript dependencies and scripts
│   └── package-lock.json    # Locked JavaScript dependency tree
├── docs/
│   ├── API.md               # Endpoint reference and payload examples
│   ├── ARCHITECTURE.md      # Request flow, data model, and frontend structure
│   ├── DEVELOPMENT.md       # Local development and contribution workflow
│   └── SECURITY.md          # Current security posture and hardening checklist
└── README.md
```

## Prerequisites

- Python 3.10 or newer.
- Node.js and npm. Node 18 LTS or newer is recommended for the current React dependencies.
- A reachable MongoDB instance, local or hosted.

## Local Setup

### 1. Start MongoDB

Run MongoDB locally or create a hosted database. The application uses the `yearbook_db` database and the `users` and `profiles` collections.

### 2. Configure the backend

From the repository root, create and activate a virtual environment:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Set the backend environment variables before starting the server. PowerShell example:

```powershell
$env:MONGO_URI = "mongodb://localhost:27017"
$env:SECRET_KEY = "replace-with-a-long-random-value"
```

The same variables can be exported using the shell syntax appropriate to macOS or Linux. See `backend/.env.example` for the variable names. The repository ignores `.env` files; never commit real credentials.

Start the API:

```powershell
uvicorn main:app --reload
```

The API and interactive OpenAPI documentation are available at:

- `http://localhost:8000`
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

### 3. Start the frontend

In a second terminal:

```powershell
cd frontend/yearbook-frontend
npm install
npm start
```

Open `http://localhost:3000`. The current frontend calls the API at `http://localhost:8000`, so both development servers must be running on their default ports.

## Typical User Flow

1. Register with an email address and password.
2. Log in. The API returns a JWT, which the frontend stores in `localStorage` under `token`.
3. Browse all profiles from the yearbook page.
4. Create a profile with a name, batch year, quote, biography, photo URL or uploaded image, and social links.
5. Open **My Profiles** to edit or delete profiles owned by the signed-in account.
6. Log out to remove the local token.

The detailed API contract is in [`docs/API.md`](docs/API.md). The frontend and backend responsibilities are described in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Useful Commands

Backend:

```powershell
cd backend
uvicorn main:app --reload
```

Frontend:

```powershell
cd frontend/yearbook-frontend
npm start
npm test
npm run build
```

The frontend includes a basic application smoke test. Build and test status, troubleshooting, and contribution guidance are in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Important Current Limitations

- Frontend API URLs are hard-coded to `http://localhost:8000`; there is no frontend environment-based API configuration yet.
- The frontend route guard checks only whether a token exists locally. It does not validate expiry or refresh expired tokens.
- Registration creates an account but does not issue a token; the current UI then navigates to a protected route and may return the user to the login screen.
- The backend `GET /yearbook` endpoint is public even though the frontend page is guarded.
- Image uploads are stored on the local filesystem, have no size limit, and currently accept the client-provided filename. This is not suitable for untrusted production traffic.
- The backend has no migrations, indexes, pagination, rate limiting, automated API tests, or centralized error logging.
- The current test suite covers only initial application rendering; it does not cover API calls, authentication, profile ownership, uploads, or the main user flows.

These are tracked as engineering notes rather than hidden behind marketing language. See [`docs/SECURITY.md`](docs/SECURITY.md) before deploying the application publicly.

## Contributing

1. Create a branch for one focused change.
2. Run the frontend build and tests, plus a Python syntax check, before opening a pull request.
3. Update the relevant documentation when an endpoint, data field, setup step, or user flow changes.
4. Do not commit secrets, local databases, uploaded personal data, `node_modules`, or virtual environments.

## License

No license file is currently included. Add a license before distributing this project or accepting external contributions under defined reuse terms.
