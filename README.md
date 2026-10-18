# queuing-system

Queueing system backend built with NestJS. Customers take a token number; staff call the next token for service.

## Running

```bash
npm install
npm run start:dev      # http://localhost:3000, Swagger UI at http://localhost:3000/api
npm test               # unit tests
npm run test:e2e       # end-to-end tests
```

Set `PORT` to change the port.

## API

| Method | Path           | Who      | Description |
|--------|----------------|----------|-------------|
| POST   | `/tokens`      | Customer | Creates a token. Returns `201` with the token `number` and `waitingAhead`. |
| POST   | `/tokens/next` | Staff    | Takes the oldest waiting token off the queue and returns it (`200`), or `404` if nobody is waiting. |

```bash
curl -X POST localhost:3000/tokens
# {"id":"…","number":1,"day":"2026-10-18","createdAt":"…","waitingAhead":0}

curl -X POST localhost:3000/tokens/next
# {"id":"…","number":1,"day":"2026-10-18","createdAt":"…"}
```

## Behaviour

- Tokens are served first-in, first-out from a single queue.
- Token numbers start at 1 each day, based on the server's local time zone (set `TZ` to control it). Tokens left unserved at the end of a day are discarded.
- Storage is in memory, so restarting the server clears the queue. Storage sits behind the `TokenRepository` abstract class (`src/tokens/repositories`), so you can swap in a database-backed implementation in `TokensModule`.
