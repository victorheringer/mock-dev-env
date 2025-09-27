# Development Environment - Docker

This project sets up a local development environment with the following services:

- PostgreSQL
- MongoDB
- Redis
- MinIO (S3-compatible storage)
- MailCatcher (email testing)
- RabbitMQ (message broker)
- Loki (log aggregation)
- Ultrahook (webhook tunnel)
- Web Clients
  - pgAdmin
  - Mongo Express
  - Redis Commander
  - MinIO Console
  - RabbitMQ Management UI
  - Grafana UI

The goal is to provide a simple infrastructure so backend and frontend containers can easily connect during development.

## Project Structure

```
docker/
├─ docker-compose.yml
├─ .env-example          # Template with default values
├─ minio/
├─ example/              # Example Node.js services and webhook server
│  ├─ services/          # Individual service test files
│  ├─ server.js          # Webhook receiver server (port 3001)
│  ├─ index.js           # Test runner for all services
│  └─ package.json       # Dependencies for examples
└─ test-app/
```

Optional files:

- postgres/init.sql → create initial tables/data in Postgres
- minio/config.json → configure buckets in MinIO

## Environment Configuration

Before starting the services, you need to create your environment configuration file:

### Quick Setup (Default Values)

Copy the example file to create your `.env`:

**Linux/macOS:**

```bash
cp .env-example .env
```

**Windows (Command Prompt):**

```cmd
copy .env-example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env-example .env
```

### Custom Configuration

1. Copy the example file: `cp .env-example .env` (or use Windows commands above)
2. Edit `.env` with your preferred text editor
3. Customize the values you want to change:

**Important variables to customize:**

```bash
# Ultrahook - Required for webhook functionality
ULTRAHOOK_NAMESPACE=<your-namespace-here>
ULTRAHOOK_API_KEY=<your-api-key-here>
ULTRAHOOK_LOCAL_URL=http://host.docker.internal:3001/<your-path-here>
```

**For Ultrahook setup:**

1. Sign up at [ultrahook.com](https://www.ultrahook.com)
2. Get your API key from the dashboard
3. Choose a unique namespace
4. Update these values in your `.env` file

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

  - URL: [http://localhost:5050](http://localhost:5050)
  - Email: [admin@dev.com](mailto:admin@dev.com)
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

  - URL: [http://localhost:8081](http://localhost:8081)
  - HTTP Login: devuser
  - HTTP Password: devpass
  - Note: Automatically connects to the Mongo container

### Redis

- Host Port: 6379
- Container: redis
- Access: no password by default
- Web Client (Redis Commander):

  - URL: [http://localhost:8082](http://localhost:8082)
  - HTTP Login: admin
  - HTTP Password: admin

- CLI:

  ```bash
  docker exec -it dev_redis redis-cli
  ```

  Example: set foo bar / get foo

### MinIO

- S3 API: [http://localhost:9000](http://localhost:9000)
- Web Console: [http://localhost:9001](http://localhost:9001)
- User: devuser
- Password: devpass123

### MailCatcher

- Container: dev_mailcatcher
- SMTP Port: 1025
- Web Port: 1080
- Web Interface URL: [http://localhost:1080](http://localhost:1080)

### RabbitMQ

- Host Port: 5672
- Container: rabbitmq
- User: devuser
- Password: devpass
- Management UI:

  - URL: [http://localhost:15672](http://localhost:15672)
  - User: devuser
  - Password: devpass

### Grafana / Loki

- Grafana UI: [http://localhost:3000](http://localhost:3000)
- Admin User: admin
- Admin Password: admin

#### Configuring Loki datasource

After starting the containers, you need to configure the Loki datasource in Grafana:

1. Open Grafana in your browser: [http://localhost:3000](http://localhost:3000)
2. Go to ⚙️ **Configuration → Data Sources → Add data source → Loki**
3. Set the **URL** to:

```
http://loki:3100
```

> Important: This URL uses the **Docker Compose service name** (`loki`) because Grafana communicates with Loki internally within Docker.
> If the URL is left empty or set incorrectly, you may see errors like `unsupported protocol scheme ""` and logs will not appear.

4. Click **Save & Test**. You should see a confirmation that the datasource is working.

#### Viewing Logs

1. Go to the **Explore** section (compass icon).
2. Select **Loki** as the datasource.
3. Use a LogQL query to filter logs, for example:

```
{service="test-service", env="dev"}
```

4. Make sure the time range includes when logs were sent (e.g., "Last 5 minutes").

Now your test logs sent from Node.js or other services should appear in Grafana.

### Ultrahook (Webhook Tunnel)

- Container: dev_ultrahook
- Host Port: 5000
- Tunnel URL: `http://<your-namespace>.<your-namespace>.ultrahook.com`
- Local Target: `http://host.docker.internal:3001/webhook-test`
- API Key: Configured in environment variables

Ultrahook creates a secure tunnel from the internet to your local development environment, allowing you to receive webhooks from external services.

> **⚠️ Important**: You need to configure your own Ultrahook credentials in the `.env` file before using this service.

#### How it works

1. **External services** send webhooks to: `http://<your-namespace>.<your-namespace>.ultrahook.com`
2. **Ultrahook tunnel** forwards the request to: `http://host.docker.internal:3001/webhook-test`
3. **Local webhook server** (in `/example` folder) receives and processes the webhook

#### Example webhook server

The project includes an example webhook server in the `example/` folder:

```bash
cd example
node server.js
```

This starts a webhook receiver on port 3001 that logs incoming webhooks:

- **Endpoint**: `http://localhost:3001/webhook-test`
- **Method**: POST
- **Response**: Returns "OK" and logs the webhook payload

#### Testing webhooks

You can test the complete webhook flow using the example scripts:

```bash
cd example
npm install
node index.js  # Runs all service tests including Ultrahook
```

Or test just the webhook:

```bash
cd example
node -e "import('./services/ultrahook.js').then(m => m.sendTestWebhook())"
```

#### Configuration

Ultrahook requires your own account and API key. See the **Environment Configuration** section at the beginning of this document for setup instructions.

After configuring your `.env` file, restart the container:

```bash
docker-compose restart ultrahook
```

Your tunnel will be available at: `http://your-namespace.your-namespace.ultrahook.com`

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
| RabbitMQ         | 5672      | 5672           |
| RabbitMQ UI      | 15672     | 15672          |
| Grafana UI       | 3000      | 3000           |
| Loki API         | 3100      | 3100           |
| Ultrahook        | 5000      | 5000           |

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
  - rabbitmq
  - loki

- The `example/` folder contains Node.js services for testing all components:
  - Run `node server.js` to start the webhook receiver on port 3001
  - Run `node index.js` to test all services including webhook functionality
  - Each service has its own test file in the `services/` subdirectory
