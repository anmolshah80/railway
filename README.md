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

- If you have run into the following issue when running `pnpm dlx prisma migrate dev` command.

  ```bash
  ◇ injected env (8) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
  Loaded Prisma config from prisma.config.ts.

  Prisma schema loaded from prisma\schema.prisma.
  Datasource "db": PostgreSQL database "railway_db", schema "public" at "localhost:5434"

  Error: P1001: Can't reach database server at `localhost:5434`

  Please make sure your database server is running at `localhost:5434`.
  ```

  - You can resolve this issue by following these steps
    - Open the `docker-compose.yml` file and change the port mapping for the Postgres service to a different port (e.g., `5434:5432`) to avoid conflicts with any local PostgreSQL installation.

      ```yaml
      # docker-compose.yml
      ports:
        - '5434:5432' # host:container
      ```

    - Then restart the containers

      ```bash
      # stop and remove containers, networks, volumes, and images created by `docker compose up`
      docker compose down -v

      # start the containers in detached mode
      docker compose up -d
      ```

    - Verify the container is reachable

      ```bash
      # check if the Postgres container is running and reachable
      docker compose ps
      ```

      _Note: You should see 0.0.0.0:5434->5432/tcp in the PORTS column._

    - Change `.env` to use the `railway_db` database:

      ```env
      DATABASE_URL="postgresql://postgres:pgadmin143@localhost:5434/railway_db?schema=public"
      ```

    - Run the migration command again

      ```bash
      cd user-service

      pnpm dlx prisma migrate dev
      ```
