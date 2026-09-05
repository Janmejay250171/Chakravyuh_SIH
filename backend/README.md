# CHAKRAVYUH Backend

## Run
```bash
cd backend
npm install
npm run seed
npm run dev
```
Server: `http://localhost:5000`

## Modes
The current implementation runs a deterministic seeded-demo fallback, allowing the prototype to work without a local MongoDB instance. The API contract and domain structure are ready for replacing the store with MongoDB/Mongoose persistence in the next integration pass.

Copy `.env.example` to `.env` if custom CORS/port settings are required.
