Troubleshooting MongoDB / Atlas connection
- Confirm `.env` exists and contains `MONGO_URI` (copy `.env.example`).
- Replace `<PASSWORD>` with DB user's password. URL-encode special characters (e.g. @ -> %40).
- Make sure your Atlas network IP whitelist includes your machine (or 0.0.0.0/0 for testing).
- Ensure the database name (`/arise`) is present in the URI or change accordingly.
- Run server: `npm run dev:server` (uses nodemon) or `npm run server`.
- Check logs: startup attempts and connection errors are printed with retry behavior.
- Test health endpoint: GET http://localhost:5000/health
- If still failing: try connecting with `mongo` shell or MongoDB Compass using same URI to isolate Atlas/network issues.
