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

### Requests

- Reset state before starting tests

```bash
curl --location --request POST 'localhost:3001/reset' \
--header 'Content-Type: application/json'
```

Output:

```bash
OK%
```

#### Get balance for non-existing account

```bash
curl --location --request GET 'localhost:3001/balance?account_id=1234' \
--header 'Content-Type: application/json'
```

Output:

```bash
0%
```

#### Create account with initial balance

```bash
curl --location --request POST 'localhost:3001/event' \
--header 'Content-Type: application/json' \
--data-raw '{"type":"deposit", "destination":"100", "amount":10}'
```

Output:

```bash
{"destination":{"id":"100","balance":10}}%
```

#### Deposit into existing account

```bash
curl --location --request POST 'localhost:3001/event' \
--header 'Content-Type: application/json' \
--data-raw '{"type":"deposit", "destination":"100", "amount":10}'
```

Output:

```bash
{"destination":{"id":"100","balance":20}}%
```

#### Get balance for existing account

```bash
curl --location --request GET 'localhost:3001/balance?account_id=100' \
--header 'Content-Type: application/json'
```

Output:

```bash
20%
```

#### Withdraw from non-existing account

```bash
curl --location --request POST 'localhost:3001/event' \
--header 'Content-Type: application/json' \
--data-raw '{"type":"withdraw", "origin":"200", "amount":10}'
```

Ouput:

```bash
0%
```

#### Withdraw from existing account

```bash
curl --location --request POST 'localhost:3001/event' \
--header 'Content-Type: application/json' \
--data-raw '{"type":"withdraw", "origin":"100", "amount":5}'
```

Ouput:

```bash
{"origin":{"id":"100","balance":15}}%
```

#### Transfer from existing account

```bash
curl --location --request POST 'localhost:3001/event' \
--header 'Content-Type: application/json' \
--data-raw '{"type":"transfer", "origin":"100", "amount":15, "destination":"300"}'
```

Ouput:

```bash
{"origin":{"id":"100","balance":0},"destination":{"id":"300","balance":15}}%
```

#### Transfer from non-existing account

```bash
curl --location --request POST 'localhost:3001/event' \
--header 'Content-Type: application/json' \
--data-raw '{"type":"transfer", "origin":"200", "amount":15, "destination":"300"}'
```

Ouput:

```bash
0%
```

### How runnig tests

1. `npm run test`
2. Coverage tests `npm run test:cov`

<img src="/images/tests.png" alt="Tests" title="Tests" align="center"/>

### Semantic commits

[Convertional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

#### Git commit msg linter

<img src="/images/git-commit-msg-linter.png" alt="Git commit Msg Linter" title="Git commit Msg Linter" align="center"/>
