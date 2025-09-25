# Development Environment - Docker

This project sets up a local development environment with the following services:

- PostgreSQL
- MongoDB
- Redis
- MinIO (S3-compatible storage)
- MailCatcher (email testing)
- Web Clients
  - pgAdmin
  - Mongo Express
  - Redis Commander
  - MinIO Console

The goal is to provide a simple infrastructure so backend and frontend containers can easily connect during development.

## Project Structure

```
docker/
├─ docker-compose.yml
├─ .env
├─ minio/
└─ test-app/
```

Optional files:

- postgres/init.sql → create initial tables/data in Postgres
- minio/config.json → configure buckets in MinIO

## How to start/stop the environment

**Prerequisites**

`Docker` | `Docker Compose`

Go to the project folder:

```shell
cd mock-dev-env
```

Start all containers in the background:

```shell
docker compose up -d
```

Check if all services are running:

```shell
docker ps
```

To stop all containers:

```shell
docker compose down
```

To stop and remove volumes (erases data):

```shell
docker compose down -v
```

## Ports and Access

### PostgreSQL

- Host Port: 5432
- Container: postgres
- User: devuser
- Password: devpass
- Database: devdb
- Web Client (pgAdmin):
  - URL: http://localhost:5050
  - Email: admin@dev.com
  - Password: admin
  - Note: Inside pgAdmin, create a server with:
    - Hostname: postgres
    - Port: 5432
    - User: devuser
    - Password: devpass

### MongoDB

- Host Port: 27017
- Container: mongo
- Root User: devuser
- Root Password: devpass
- Web Client (Mongo Express):
  - URL: http://localhost:8081
  - HTTP Login: devuser
  - HTTP Password: devpass
  - Note: Automatically connects to the Mongo container

### Redis

- Host Port: 6379
- Container: redis
- Access: no password by default
- Web Client (Redis Commander):
  - URL: http://localhost:8082
  - HTTP Login: admin
  - HTTP Password: admin
- CLI:
  docker exec -it dev_redis redis-cli
  Example: set foo bar / get foo

### MinIO

- S3 API: http://localhost:9000
- Web Console: http://localhost:9001
- User: devuser
- Password: devpass123

### MailCatcher

- Container: dev_mailcatcher
- SMTP Port: 1025
- Web Port: 1080
- Web Interface URL: http://localhost:1080

### Summary of Exposed Ports

| Service          | Host Port | Container Port |
| ---------------- | --------- | -------------- |
| PostgreSQL       | 5432      | 5432           |
| pgAdmin          | 5050      | 80             |
| MongoDB          | 27017     | 27017          |
| Mongo Express    | 8081      | 8081           |
| Redis            | 6379      | 6379           |
| Redis Commander  | 8082      | 8081           |
| MinIO API        | 9000      | 9000           |
| MinIO Console    | 9001      | 9001           |
| MailCatcher SMTP | 1025      | 1025           |
| MailCatcher Web  | 1080      | 1080           |

## MinIO Client (mc)

The MinIO Client (`mc`) is a command-line tool to interact with your MinIO server. It allows you to manage buckets, upload and download files, and perform administrative tasks directly from a terminal.

### Accessing the mc console

We provide an interactive `mc` container that is pre-configured with your MinIO credentials. To access it, run:

```bash
docker compose run mc
```

This will open a shell inside the container with the MinIO alias `localminio` already set up. You do not need to enter the access key or secret manually.

### Basic mc commands

Once inside the `mc` shell, you can use the following commands:

- **List buckets**:

```bash
mc ls localminio
```

- **Create a new bucket**:

```bash
mc mb localminio/test
```

- **Upload a file to a bucket**:

```bash
echo "Hello MinIO!" > test.txt
mc cp test.txt localminio/test/
```

- **List files in a bucket**:

```bash
mc ls localminio/test
```

- **View server information**:

```bash
mc admin info localminio
```

- The `mc` container is interactive, so you can use it as a CLI to manage your MinIO instance anytime.
- It shares the same Docker network as your MinIO container, so you can access MinIO using the service name (`minio`) instead of \`loc

## Notes

- This environment is for local development only.
- For production, use secure environment variables and a secrets management system.
- All web clients use HTTP authentication for access.
- Backend/Frontend containers can connect using Docker service names:
  - postgres
  - mongo
  - redis
  - minio
  - mailcatcher
