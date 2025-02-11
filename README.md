[![Deployment to Railway](https://github.com/williamkoller/challenge-ebanx/actions/workflows/deployment.yml/badge.svg)](https://github.com/williamkoller/challenge-ebanx/actions/workflows/deployment.yml)

<img src="/images/log-ebanx.png" alt="Ebanx" title="Ebanx" height="80" width="200" align="right"/>

## Ebanx Challenge

### Objective

- The API consists of two endpoints, `GET /balance`, and `POST /event`. Using your favorite programming language, build a system that can handle these requests.

### Requirements

- `docker`, `docker-compose`, `nodejs` and `nestjs`

### Installation

1. Use `nvm use` to set the `nodejs` version specified in the project. See the file `.nvmrc`.
2. Install dependencies with `npm ci`.
3. Copy environment variables: `cp .env.example .env`.

### How to Run

- Start the application with Docker: `npm run docker:start --build`.

- Application running:

<img src="/images/terminal.png" alt="Terminal" title="Terminal" align="center"/>
