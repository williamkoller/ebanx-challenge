[![Deployment to Railway](https://github.com/williamkoller/challenge-ebanx/actions/workflows/deployment.yml/badge.svg)](https://github.com/williamkoller/challenge-ebanx/actions/workflows/deployment.yml)

<img src="/images/log-ebanx.png" alt="Ebanx" title="Ebanx" height="80" width="200" align="right"/>

## Challenge Ebanx

### Proposal

- The API consists of two endpoints, `GET /balance`, and `POST /event`. Using your favorite programming language, build a system that can handle those requests.

### Requirements

- `docker`, `docker-compose`, `nodejs` and `nestjs`

### Installation

1. use `nvm use` to set the `nodejs` version in this project, see the file `.nvmrc`
2. install `npm ci`
   3 . `cp .env.example .env`

### How running?!

- `npm run docker:start --build`

- App running

<img src="/images/terminal.png" alt="Terminal" title="Terminal" align="center"/>
