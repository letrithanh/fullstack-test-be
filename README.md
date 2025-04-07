# How to run

## Environment variables

```
# DATABASE_URL=<database's URL>
```

For example:

```bash
DATABASE_URL="mysql://root:asdofhasdfh234234gdsf@localhost:33007/testdb"
```

## Commands

For running unit tests, and integration tests

``` bash
npx prisma migrate dev

npm run test
```

For Production

```
npm run build
npm run start
```