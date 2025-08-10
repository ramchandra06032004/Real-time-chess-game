## Real-Time Chess Game

This project consists of three independent servers:

- **Frontend & Auth:** Next.js app (`next-fe`)
- **Backend:** WebSocket server for real-time chess logic (`ws-backend`)
- **RabbitMQ Worker:** Worker/consumer to fetch moves from RabbitMQ and store them in the database (`rabbitMq-worker`)

---

### Prerequisites

- Latest [Node.js](https://nodejs.org/) (LTS or Current)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or your own MongoDB instance)
- [Docker](https://www.docker.com/) (to run RabbitMQ)
- [RabbitMQ](https://www.rabbitmq.com/) instance (local or cloud-hosted)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/ramchandra06032004/Real-time-chess-game.git
cd Real-time-chess-game
```

### 2. Environment Variables

All servers require a `.env` file. Copy the example files and edit them with your own values:

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
```

#### For RabbitMQ Worker:
```bash
cd rabbitMq-worker
cp .env.example .env
# Edit .env and set your MongoDB Atlas URL and RabbitMQ connection details
```

---

## Running the Projects

Start the servers one by one in the following order:

### 1. Start RabbitMQ using Docker

To run the RabbitMQ worker, you need a RabbitMQ instance. You can use the official RabbitMQ Docker image with the management plugin:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

- The RabbitMQ server will be available at `http://localhost:15672` (default username: `guest`, password: `guest`).
- Ports used by RabbitMQ:
  - `5672`: For RabbitMQ messaging protocol.
  - `15672`: For RabbitMQ Management UI.
- Ensure the RabbitMQ connection details in the `.env` file for the RabbitMQ worker are correct.

### 2. Start the Next.js frontend
```bash
cd next-fe
npm install
npm run dev
# By default, runs on http://localhost:3000
```

### 3. Start the WebSocket backend
```bash
cd ws-backend
npm install
npm run dev
# By default, runs on http://localhost:8080 (or check your .env)
```

### 4. Start the RabbitMQ Worker
```bash
cd rabbitMq-worker
npm install
npm run dev
# This worker fetches moves from RabbitMQ and stores them in the database
```

---

## Notes

- Make sure your MongoDB Atlas cluster is running and accessible from your local machine.
- Ensure RabbitMQ is running and accessible.
- Update all required secrets in the `.env` files for all three servers.
- For production, use `npm run build` and `npm start` (if configured).
- Resend Email service is used for email notifications. Ensure you have configured it properly in the `.env` files.

---

## Folder Structure

- `next-fe/` — Next.js frontend and authentication
- `ws-backend/` — WebSocket backend for real-time chess logic
- `rabbitMq-worker/` — RabbitMQ worker to process moves and store them in the database




