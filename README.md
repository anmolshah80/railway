# Railway App

## Database Setup

- Ensure you have a Postgres database set up and running from `pgAdmin` or, you can create a new database using the following [command](https://www.postgresql.org/docs/current/app-createdb.html):

  ```bash
  createdb -p 5433 -h localhost -U postgres -e your_database_name
  ```

  _Note: You may need to adjust the port, host, username, and database name according to your Postgres setup. And, you may need to enter your postgres user password in bash terminal when prompted._

## Notes

- [Configure pnpm for the best possible developer experience](https://adamcoster.com/blog/pnpm-config)

- [Managing a full-stack, multi-package monorepo using pnpm](https://www.codecapers.com.au/pnpm-workspaces/)
  - [pnpm-workspace.yaml](https://pnpm.io/pnpm-workspace_yaml)

  - [Pnpm Catalogs](https://pnpm.io/catalogs)
