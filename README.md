# docker-todo-fullstack

[![CI](https://github.com/Alike001/docker-todo-fullstack/actions/workflows/ci.yml/badge.svg)](https://github.com/Alike001/docker-todo-fullstack/actions/workflows/ci.yml)

A full-stack to-do app built end-to-end and dockerized with Docker Compose. One command spins up the frontend, backend, and a persistent database.

## Stack

- **Frontend** — React 19 + Vite + TypeScript, served by nginx in production
- **Backend** — Node.js + Express + better-sqlite3
- **Containerization** — Docker (multi-stage build for the frontend) + Docker Compose
- **Persistence** — Named Docker volume so todos survive container restarts

## Quick start

You need [Docker](https://docs.docker.com/get-docker/) installed.

```bash
git clone https://github.com/Alike001/docker-todo-fullstack.git
cd docker-todo-fullstack
docker compose up --build
```

Then open **http://localhost:8080**.

To stop:

```bash
docker compose down
```

Your todos persist between runs because the SQLite database lives in a named volume.

## API

The backend exposes a small REST API on port 3000.

| Method | Path          | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/todos`      | List all todos            |
| POST   | `/todos`      | Create a todo (`{title}`) |
| PATCH  | `/todos/:id`  | Toggle done               |
| DELETE | `/todos/:id`  | Delete a todo             |

## Project structure

```
docker-todo-fullstack/
├── backend/
│   ├── server.js          # Express app + SQLite
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/               # React app
│   ├── Dockerfile         # Multi-stage: Node build → nginx serve
│   └── .dockerignore
└── docker-compose.yml     # Orchestrates both services + volume
```