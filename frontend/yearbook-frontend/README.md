# Yearbook Frontend

This directory contains the React client for Open Source Yearbook. Read the repository-level [README](../../README.md) for the complete product overview, architecture, API contract, security notes, and development workflow.

## Run Locally

```powershell
npm install
npm start
```

The development server runs at `http://localhost:3000` and expects the FastAPI backend at `http://localhost:8000`.

## Verify

```powershell
npm test -- --watchAll=false
npm run build
```

The frontend currently uses Create React App, Tailwind CSS, React Router, Axios, and the native Fetch API. API URLs are currently hard-coded in the source and should be centralized before deploying to another environment.
