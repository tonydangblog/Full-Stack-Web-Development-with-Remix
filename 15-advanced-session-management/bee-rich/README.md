# 14. Advanced Session Management

In this chapter, we will practice advanced session management patterns. We will use cookies to track visitor sessions and implement pagination for expenses and invoices.

## Getting started

There is nothing to set up for this chapter! You can go ahead and use [the solution code from the previous chapter](../../14-real-time-with-remix/) to get started with _Chapter 15, Advanced Session Management_.

Happy coding!

### Run the application

Follow these steps to get your application up and running:

1. Make sure you have a `.env` file in the root of your project and that it contains the following:

```text
DATABASE_URL="file:./dev.db"
SESSION_SECRET="[A secret string]"
```

2. Install the dependencies.

```bash
npm install
```

3. Generate the Prisma client

```bash
npm run build
```

4. Update the SQLite database schema

```bash
npm run update:db
```

5. Start the development server

```bash
npm run dev
```

This starts the development server on port `3000`. You can now open the application in your browser at [http://localhost:3000](http://localhost:3000).

In case you receive Prisma errors during build, schema update, or runtime, you can reset the database by running the following command:

```bash
npm run reset:db
```

6. Seed the database with test data

```bash
npm run seed
```

This is optional, but can be helpful for testing.

Test credentials:

- Email: john.doe@example.com
- Password: BeeRich

You can also update the seed data in `prisma/seed.ts`.
