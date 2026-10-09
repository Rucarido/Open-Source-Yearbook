# Development Guide

## Working Directories

The backend and frontend are separate applications. Run commands from the directory that owns the relevant manifest:

- Python commands: `backend/`
- npm commands: `frontend/yearbook-frontend/`

## Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:MONGO_URI = "mongodb://localhost:27017"
$env:SECRET_KEY = "local-development-secret"
uvicorn main:app --reload
```

For macOS or Linux, activate with `source venv/bin/activate` and use `export` for environment variables.

The backend reads its MongoDB URI and JWT signing key from the process environment. The default MongoDB URI is local-only and the default JWT key is for development fallback; always set an explicit secret outside local development.

## Frontend Setup

```powershell
cd frontend/yearbook-frontend
npm install
npm start
```

The frontend expects the backend at `http://localhost:8000` and the development server at `http://localhost:3000`. Those URLs are currently hard-coded in the source.

## Verification

Run a Python syntax check:

```powershell
python -m compileall backend
```

Run the frontend test runner once in CI-style mode:

```powershell
cd frontend/yearbook-frontend
npm test -- --watchAll=false
```

Create a production frontend bundle:

```powershell
npm run build
```

The current test suite contains a basic application-rendering test and should be expanded before relying on it as a quality gate.

## Manual Smoke Test

1. Start MongoDB, the backend, and the frontend.
2. Open `http://localhost:3000`.
3. Register a new account.
4. Log in with the account.
5. Create a profile and verify it appears in the yearbook list.
6. Open **My Profiles**, edit the profile, and verify the public card updates.
7. Delete the profile and verify it is removed.
8. Log out and confirm the protected page redirects to the login page.

## Common Problems

### MongoDB connection errors

Check that MongoDB is running and that `MONGO_URI` is set in the same terminal process that starts Uvicorn. For a hosted database, verify network access and credentials.

### CORS errors

The API currently allows the local origins `localhost:3000`, `localhost:3001`, and `localhost:5173`. Add a deliberate origin in `backend/main.py` if using another development port; do not use `*` together with credentials in production.

### Images do not display

The upload response is built for `http://localhost:8000`. If the backend is running elsewhere, the returned URL and frontend API configuration must be made environment-aware.

### Registration returns to login

Registration does not issue a JWT. The current frontend navigates to `/yearbook` immediately after registration, but the protected route requires a token. Log in after registering. This flow should be corrected in a future frontend change.

## Contribution Workflow

- Keep changes focused and update the relevant docs with behavior changes.
- Add or update tests for endpoint and ownership rules before changing those rules.
- Use environment variables for secrets and service URLs.
- Avoid committing uploaded images, credentials, virtual environments, `node_modules`, or build output.
- Include manual verification steps in pull requests when automated coverage is not available.
