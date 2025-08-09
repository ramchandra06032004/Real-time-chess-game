## Real-Time Chess Game

This project consists of two independent servers:

- **Frontend & Auth:** Next.js app (`next-fe`)
- **Backend:** WebSocket server for real-time chess logic (`ws-backend`)

---

### Prerequisites

- Latest [Node.js](https://nodejs.org/) (LTS or Current)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or your own MongoDB instance)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd Real-time-chess-game
```

### 2. Environment Variables

Both servers require a `.env` file. Copy the example files and edit them with your own values:

#### For Next.js frontend:
```bash
cd next-fe
cp .env.example .env
# Edit .env and set your MongoDB Atlas URL and other secrets
```

#### For ws-backend:
```bash
cd ws-backend
cp .env.example .env
# Edit .env and set your MongoDB Atlas URL and other secrets
```

---

## Running the Projects

You can run both servers independently. There is no strict order.

### 1. Start the Next.js frontend
```bash
cd next-fe
npm install
npm run dev
# By default, runs on http://localhost:3000
```

### 2. Start the WebSocket backend
```bash
cd ws-backend
npm install
npm run dev
# By default, runs on http://localhost:8080 (or check your .env)
```

---

## Notes

- Make sure your MongoDB Atlas cluster is running and accessible from your local machine.
- Update all required secrets in both `.env` files.
- For production, use `npm run build` and `npm start` (if configured).
- Email and other third-party services may require additional setup (see `.env.example`).

---

## Folder Structure

- `next-fe/` — Next.js frontend and authentication
- `ws-backend/` — WebSocket backend for real-time chess logic

---

## License

MIT
