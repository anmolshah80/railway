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
        - '5434:5432' # host_port:docker_container_port
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

- `Secure: true` with an HTTP URL (e.g., `http://localhost:4001`). Postman respects `Secure` and will not store the cookie for non-HTTPS endpoints so either,
  - Set `secure: false` in `development` or,
  - Change the route names, and request bodies in the same request (inside the Postman collection)
  - Use `/api/v1/auth/send-otp` to send otp to the user with the following request body to test the route in Postman

    ```json
    {
      "firstName": "John",
      "lastName": "Wick",
      "email": "johnwick@gmail.com",
      "password": "JohnWick@143",
      "confirmPassword": "JohnWick@143"
    }
    ```

  - Use `/api/v1/auth/verify-otp` to verify otp sent by the user with the following request body to test the route in Postman

    ```json
    {
      "otp": "535003"
    }
    ```

## How to add the server in pgAdmin

`pgAdmin` doesn't auto-discover databases. It's just a management UI — when you open it for the first time, there are zero server connections registered. You have to add the PostgreSQL server yourself. The database `railway_db` is being created (your compose file's `POSTGRES_DB: railway_db` does that on first boot), you just haven't told pgAdmin where to find it.

- In the pgAdmin left sidebar, right-click **Servers → Register → Server…**

- On the **General** tab, give it any name, e.g. `railway-postgres`.

- On the **Connection** tab, use these values:

  | Field                | Value        |
  | -------------------- | ------------ |
  | Host name/address    | `postgres`   |
  | Port                 | `5432`       |
  | Maintenance database | `postgres`   |
  | Username             | `postgres`   |
  | Password             | `pgadmin143` |

  **Important:** Use `postgres` as the host and `5432` as the port — not `localhost` and not `5434`.

  Why? pgAdmin and Postgres are **both containers on the same Docker network** (`railway-backend_default`). Inside a Docker network, containers reach each other by **service name** (`postgres`) on the internal container port (`5432`). The `5434:5432` mapping only exists for things running on your host machine (like your Node app + Prisma).

  Also — `localhost` inside the pgAdmin container would refer to the pgAdmin container itself, not Postgres. That's a very common source of confusion.

- Optionally, check Save password? so you don't retype it.

- Click Save.
