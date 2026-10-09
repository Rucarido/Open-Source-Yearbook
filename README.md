# Open Source Yearbook

Open Source Yearbook is a full-stack application for collecting and browsing community profiles. Authenticated users can create, edit, and delete their profiles; visitors can browse the public yearbook.

## Stack

| Layer | Technology |
| --- | --- |
| Client | React 19, React Router, Tailwind CSS |
| API | Python, FastAPI, Uvicorn |
| Authentication | JWT (`python-jose`), bcrypt (`passlib`) |
| Database | MongoDB via PyMongo |
| Uploads | Validated image files in `backend/static/uploads` |

## Repository Layout

```text
backend/                     FastAPI app, MongoDB access, schemas, and authentication
frontend/yearbook-frontend/  React single-page application
docs/                        Architecture, API, development, and security notes
Campus_Yearbook/             Earlier static prototype; not used by the full-stack app
```

## Run Locally

Prerequisites: Python 3.10+, Node 18+, and MongoDB.

1. Configure and start the API:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:MONGO_URI = "mongodb://localhost:27017"
$env:SECRET_KEY = "replace-with-a-long-random-value"
uvicorn main:app --reload
```

2. Configure and start the frontend:

```powershell
cd frontend/yearbook-frontend
Copy-Item .env.example .env
npm install
npm start
```

The frontend runs at `http://localhost:3000`; the API and OpenAPI documentation run at `http://localhost:8000` and `http://localhost:8000/docs`.

Set `REACT_APP_API_URL` in the frontend `.env` when the API is hosted elsewhere. `.env` files are intentionally ignored and must not contain committed credentials.

## Routes

- Browser routes: `/` displays login/registration; `/yearbook` requires a locally stored access token.
- API routes: see [`docs/API.md`](docs/API.md).
- API design and request flow: see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
- Security and deployment limitations: see [`docs/SECURITY.md`](docs/SECURITY.md).

## Validation

```powershell
cd backend
python -m compileall -q .

cd ../frontend/yearbook-frontend
npm test
npm run build
```

## Current Limitations

- Images are local files; production should use managed object storage.
- There are no refresh tokens, pagination, database migrations, rate limiting, or API integration tests.
- Before public deployment, configure production CORS, HTTPS, monitoring, database indexes, backups, and a secret-management solution.

## License

No license file is currently included. Add one before accepting outside contributions or distributing the project.
