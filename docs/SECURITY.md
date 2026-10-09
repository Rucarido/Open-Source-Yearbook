# Security Notes

This document describes the security posture of the current codebase. It is an engineering checklist, not a claim that the application is production-ready.

## Existing Controls

- Passwords are hashed with bcrypt through Passlib.
- Login returns a signed JWT with a 30-minute expiration.
- Protected profile operations derive the owner from the JWT rather than accepting an owner id from the client.
- Update and delete queries include the authenticated user's email to enforce ownership.
- CORS is limited to three local development origins.
- Environment variables are used for the MongoDB URI and JWT signing key.

## High-Priority Risks

### Do not expose account secrets

Never commit `MONGO_URI`, hosted database credentials, or a production `SECRET_KEY`. Use process environment variables or a managed secret store. Rotate any credential that has previously been committed or shared.

### Remove password hashes from registration responses

`POST /register` currently returns `UserInDB`, whose response includes `hashed_password`. Password hashes must never be sent to clients. Return a public user schema containing only the id and email.

### Secure image uploads

`POST /upload` currently has no authentication and uses the client-provided filename. Before public deployment:

- Require authentication.
- Generate a random server-side filename.
- Validate content by inspecting file bytes, not only the declared MIME type.
- Enforce file size and image dimension limits.
- Store files outside the application process or in object storage.
- Prevent path traversal and filename collisions.
- Remove orphaned files when a profile is deleted or its photo changes.

### Replace the development JWT fallback

The fallback signing key exists to make local setup easy. Production must fail fast when `SECRET_KEY` is absent, use a high-entropy secret, and use an appropriate key rotation strategy.

### Validate user-controlled URLs

Profile social links and `photo_url` are rendered as external links or image sources. Validate allowed schemes such as `https`, consider an allowlist where appropriate, and use a content security policy to reduce injection and tracking risk.

## Additional Hardening

- Review `npm audit` output before releases. The current dependency tree reports known vulnerabilities in production dependencies, including Axios and its transitive packages; do not treat a successful frontend build as a security approval.
- Add rate limiting and account lockout or abuse detection to registration and login.
- Add HTTPS and secure deployment headers.
- Replace `localStorage` token storage with a carefully designed secure cookie strategy if the threat model requires stronger XSS resistance.
- Avoid logging tokens, credentials, uploaded content, or personal profile data.
- Add structured error handling so internal exceptions are not exposed to clients.
- Add database indexes and uniqueness enforcement for user email addresses.
- Add automated tests for invalid tokens, expired tokens, cross-user profile access, and upload abuse.
- Restrict CORS to the deployed frontend origin.
- Add authorization to any future profile administration or moderation features.
- Define a retention and deletion policy for profile data and uploaded photos.

## Deployment Gate

Do not deploy the current application to an untrusted public environment until the high-priority risks above are addressed, especially password-hash exposure and unrestricted local file uploads.
