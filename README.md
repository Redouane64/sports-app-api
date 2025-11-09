# Sports Tracker and Challenges API

The API provides the ability for outdoor sport activity enthusiasts to track and share 
their tracks/courses for sports such as cycling, hiking, running, skiing, etc. 
Users of this platform can publish their tracks and share them with others. Other users can
explore published tracks and participate by creating records for any published track, and can
view other users' records.

The platform is also intended to provide users with meaningful metrics about their recorded
data.

Tracks and records are intended to be recorded via fitness apps and watches (GPX format) and 
uploaded to the platform in GeoJSON format.

The current implementation includes tracks and records creation, listing, update, and deletion endpoints. 
Records are evaluated against tracks using the Dynamic Time Warping (DTW) algorithm.
Additionally, users can query how far a published track is from their location, and 
the total distance covered by tracks or records is dynamically calculated from their route GeoJSON path.

The calculated record similarity score is not visible to the API consumer. When the score exceeds a defined
threshold, the record is marked with status `REJECTED`; otherwise, it is marked as `ACCEPTED`.

This project is a hobby idea I wanted to work on this summer but did 
not have time to sit and plan for features.

## Available functionality

- [x] Track Create, List, Read, Update, and Delete with filtering and pagination (see Swagger docs)
- [x] Record Create, List, and Delete with filtering and pagination (see Swagger docs)
- [x] Track distance to user measurement via `distance` field in `Track` object
- [x] Authentication via JWT with login, register, token refresh, and logout endpoints
- [x] Cron job every 5 minutes to process and score (using DTW algorithm) user-created records with `DRAFT` status

### Future plans and trade-off

If I have more time, feature-wise I would add these features:

- Add timestamps (available in GPX files format by default) to parse time and use it for validation 
in addition to DTW algorithm to have more accurate verification process

- Read additional metrics such as speed, heart rates to provide additional metrics to users and possibly 
accurate records verification process

- Add file upload endpoints so clients can send directly .GPX files to parse extract data explained above

- Add map picture generation using Mapbox API to create picture of track and records routes so users can 
see how a route looks like on the map

Technical concerns to address:

- Add data caching and proper API caching headers

- Currently database tables `tracks` and `records` are not tested in case of
large data and additional indices should be created to support filtering and
maintain acceptable query speed

- Move CronJob to PubSub mechanism such as Postgres PubSub and use row-lock
mechanism when processing records rows to avoid duplicate row processing when scaling the backend with multiple instances

- Currently entities are used as response DTOs with `@Exclude()` decorators from `class-transformer` to hide fields that should be
hidden from API consumers. It would probably be better to create separate DTOs for responses if API complexity grows
and to support API versioning with backward compatibility

- Add proper commit lint rules, fix inconsistent import base path and more test coverage

- Move magic strings in thrown exceptions to constants and refactor e2e tests code for reusable code

- Currently logging setup allows tracking errors and observe SQL statement executed for database performance measurement. I think 
this is good enough for current implementation but as complexity grows it may be better to introduce OTEL integration for more effective
monitoring

## Tech used:
- NestJS
- Postgres with PostGIS extensions
- Docker

## Setup

1. Install dependencies: `npm i`

2. Run Postgresql docker container: `docker compose up -d postgres`

3. Copy `.env.development` to `.env` or create `.env` file with this content:

```bash
NODE_ENV=development

HOST=127.0.0.1
PORT=5000

LOGGING_LEVEL=debug

JWT_SECRET=634bca25-fa1c-4557-b67f-aa3817e1c5bd
JWT_TOKEN_EXPIRES=84000

DATABASE_URL=postgresql://admin:admin@localhost:14321/sports-app-db
```
4. Run database migration: `npm run migration:run`

5. Run `npm run start` or `npm run start:dev`


## OpenAPI docs & Postman

- Swagger docs available at: `http://localhost:5000/docs`
- Postman collection `postman_collection.json` file

## Running E2E tests

1. Make sure test database container is running: `docker compose up -d postgres-test`

2. Run tests: `npm run test:e2e`

## Project structure

The project takes advantage of NestJS modules to create feature modules. Additional modules
are used to set up infrastructure-related services.

### **Feature modules**
- **Track:** contains types, service and API controller for Track data manipulation
- **Record:** contains types, service and API controller for Record data manipulation
- **Auth:** contains authentication logic, JWT strategies, and user management
- **Common:** shared types and interfaces

### **Infrastructure modules**
- **Database:** contains TypeORM configuration factories
- **Logging:** contains logging configuration factory
- **Config:** Configuration setup for reading from environment variables and `.env` files

