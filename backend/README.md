

This is the backend server for FastFriends.  It uses the following framworks:
- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- [TypeORM]()
- [Postgress]()

## Installation

Clone the repository (if not already cloned)
```bash
$ git clone https://github.com/rvernick/fast-friends.git
```
Move to backend repository on local device
```bash
$ cd fast-friends/backend/
```
Install Backend package.json
```bash
npm install
npm run typeorm migration:run -- -d src/data-source.ts
```

Create Migrations
We use a database just for migration creation.  The idea is that a dev database will automatically add tables/columns.  Having a DB that just takes an install and then creates the delta for migrating is better
using --dryrun is handy for testing
```bash
npm run typeorm migration:generate -- -d src/migration-source.ts ./migrations/<NameOfMigration>
```

## 

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



