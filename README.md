# Mock Development Environment

[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2.0+-blue.svg)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🐳 **Complete Docker-based development environment** with 8+ pre-configured services for modern web development

## ⚡ Quick Start

```bash
# 1. Clone and navigate
git clone https://github.com/victorheringer/mock-dev-env.git
cd mock-dev-env

# 2. Setup environment
cp .env-example .env

# 3. Start all services
docker-compose up -d

# 4. Verify everything is running
docker-compose ps
```

✅ **That's it!** All services are now running and accessible.

## 📊 Services Overview

| Service            | URL                                       | Default Credentials  | Purpose               |
| ------------------ | ----------------------------------------- | -------------------- | --------------------- |
| 🐘 **PostgreSQL**  | `localhost:5432`                          | `devuser/devpass`    | Relational database   |
| 🍃 **MongoDB**     | `localhost:27017`                         | `devuser/devpass`    | Document database     |
| 🔴 **Redis**       | `localhost:6379`                          | No auth              | Cache & sessions      |
| 📦 **MinIO**       | [localhost:9001](http://localhost:9001)   | `devuser/devpass123` | S3-compatible storage |
| 📧 **MailCatcher** | [localhost:1080](http://localhost:1080)   | No auth              | Email testing         |
| 🐰 **RabbitMQ**    | [localhost:15672](http://localhost:15672) | `devuser/devpass`    | Message broker        |
| 📈 **Grafana**     | [localhost:3000](http://localhost:3000)   | `admin/admin`        | Monitoring & logs     |
| 🌐 **Ultrahook**   | Custom URL                                | Your credentials     | Webhook tunnel        |

### 🎛️ Web Management Interfaces

- **pgAdmin**: [localhost:5050](http://localhost:5050) - PostgreSQL admin
- **Mongo Express**: [localhost:8081](http://localhost:8081) - MongoDB admin
- **Redis Commander**: [localhost:8082](http://localhost:8082) - Redis admin
- **MinIO Console**: [localhost:9001](http://localhost:9001) - File storage admin
- **RabbitMQ Management**: [localhost:15672](http://localhost:15672) - Queue admin

**🎯 Goal**: Provide a complete development infrastructure so your applications can easily connect to databases, queues, storage, and external services during development.

## 📁 Project Structure

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

## ⚙️ Environment Configuration

> **📋 Important**: You must create a `.env` file before starting the services.

### 🚀 Quick Setup (Recommended)

For most users, the default values work perfectly:

```bash
# Linux/macOS
cp .env-example .env

# Windows (Command Prompt)
copy .env-example .env

# Windows (PowerShell)
Copy-Item .env-example .env
```

### 🔧 Custom Configuration

For advanced users or specific requirements:

1. **Copy the template**: `cp .env-example .env`
2. **Edit the file**: `nano .env` (or your preferred editor)
3. **Customize these important variables**:

```bash
# 🌐 Ultrahook - Required for webhook functionality
ULTRAHOOK_NAMESPACE=<your-namespace-here>
ULTRAHOOK_API_KEY=<your-api-key-here>

# 🔒 Security - Recommended for production-like testing
POSTGRES_PASSWORD=<your-secure-password>
GRAFANA_ADMIN_PASSWORD=<your-admin-password>
```

**🌐 Ultrahook Setup** (for webhook testing):

1. Sign up at [ultrahook.com](https://www.ultrahook.com)
2. Get your API key from the dashboard
3. Choose a unique namespace
4. Update the values in your `.env` file

> **💡 Tip**: Leave other values as defaults unless you have specific requirements.

## 🚀 Getting Started

### Prerequisites

- **Docker** (20.10+) and **Docker Compose** (2.0+)
- **Git** for cloning the repository

### Start All Services

```bash
# Navigate to project folder
cd mock-dev-env

# Start all services in background
docker-compose up -d

# Check everything is running
docker-compose ps
```

### Useful Commands

```bash
# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f postgres

# Stop all services (keeps data)
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# Restart specific service
docker-compose restart ultrahook
```

## 📋 Service Details

> **💡 Quick Reference**: See the [Services Overview](#-services-overview) table above for URLs and credentials.

<details>
<summary><strong>🐘 PostgreSQL Configuration</strong></summary>

**Connection Details:**

- Host: `localhost:5432` (external) or `postgres:5432` (internal)
- Database: `devdb`
- User/Pass: `devuser/devpass`

**pgAdmin Access:**

- URL: [localhost:5050](http://localhost:5050)
- Login: `admin@dev.com` / `admin`
- **Setup**: Create new server with hostname `postgres`, port `5432`
</details>

<details>
<summary><strong>🍃 MongoDB Configuration</strong></summary>

**Connection Details:**

- URI: `mongodb://devuser:devpass@localhost:27017` (external)
- URI: `mongodb://devuser:devpass@mongo:27017` (internal)

**Mongo Express Access:**

- URL: [localhost:8081](http://localhost:8081)
- Login: `devuser/devpass`
</details>

<details>
<summary><strong>🔴 Redis Configuration</strong></summary>

**Connection Details:**

- Host: `localhost:6379` (external) or `redis:6379` (internal)
- No password required

**Redis Commander:**

- URL: [localhost:8082](http://localhost:8082)
- Login: `admin/admin`

**CLI Access:**

```bash
docker exec -it dev_redis redis-cli
```

</details>

<details>
<summary><strong>📦 MinIO (S3) Configuration</strong></summary>

**Connection Details:**

- API Endpoint: `http://localhost:9000`
- Access Key: `devuser`
- Secret Key: `devpass123`
- Default Bucket: `test`

**Web Console:**

- URL: [localhost:9001](http://localhost:9001)
- Login: `devuser/devpass123`
</details>

<details>
<summary><strong>📧 MailCatcher Configuration</strong></summary>

**SMTP Settings (for your app):**

- Host: `mailcatcher` or `localhost`
- Port: `1025`
- No authentication required

**Web Interface:**

- URL: [localhost:1080](http://localhost:1080)
- View all sent emails here
</details>

<details>
<summary><strong>🐰 RabbitMQ Configuration</strong></summary>

**Connection Details:**

- Host: `rabbitmq:5672` (internal) or `localhost:5672` (external)
- User/Pass: `devuser/devpass`
- Default Queue: `test-queue`

**Management UI:**

- URL: [localhost:15672](http://localhost:15672)
- Login: `devuser/devpass`
</details>

<details>
<summary><strong>📈 Grafana & Loki Setup</strong></summary>

**Grafana Access:**

- URL: [localhost:3000](http://localhost:3000)
- Login: `admin/admin`

**Loki Configuration:**

1. Go to **Configuration → Data Sources → Add Loki**
2. Set URL to: `http://loki:3100`
3. Save & Test

**Viewing Logs:**

- Go to **Explore** section
- Use LogQL queries like: `{service="test-service", env="dev"}`
</details>

<details>
<summary><strong>🌐 Ultrahook Configuration</strong></summary>

Ultrahook requires your own account and API key. See the **Environment Configuration** section for setup instructions.

After configuring your `.env` file:

```bash
docker-compose restart ultrahook
```

Your tunnel will be available at: `http://your-namespace.your-namespace.ultrahook.com`

</details>

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

## 🧪 Testing & Examples

The `example/` folder contains Node.js services to test all components:

### Run All Tests

```bash
cd example
npm install
node index.js  # Tests all services including webhooks
```

### Individual Service Tests

```bash
cd example

# Test specific services
node -e "import('./services/postgres.js').then(m => m.createRegisterPostgres())"
node -e "import('./services/mongo.js').then(m => m.createRegisterMongo())"
node -e "import('./services/ultrahook.js').then(m => m.sendTestWebhook())"
```

### Webhook Testing

```bash
# Start webhook receiver
node server.js  # Runs on port 3001

# In another terminal, test webhook flow
node -e "import('./services/ultrahook.js').then(m => m.sendTestWebhook())"
```

**Expected output:**

```
=== Testing PostgreSQL ===
✅ Connected to PostgreSQL
✅ Record inserted

=== Testing Ultrahook ===
✅ Webhook sent to http://your-namespace.ultrahook.com
📨 Response: 200 OK
```

## 🔧 Troubleshooting

<details>
<summary><strong>🐳 Services won't start</strong></summary>

**Common solutions:**

- Check if ports are in use: `netstat -tuln | grep :5432`
- Verify Docker is running: `docker info`
- Reset everything: `docker-compose down -v && docker-compose up -d`
- Check Docker logs: `docker-compose logs`
</details>

<details>
<summary><strong>🌐 Ultrahook not working</strong></summary>

**Check these:**

- Verify credentials in `.env` file
- Check container logs: `docker logs dev_ultrahook`
- Ensure webhook server is running: `cd example && node server.js`
- Test direct connection: `curl -X POST http://localhost:3001/webhook-test`
</details>

<details>
<summary><strong>🔐 Can't access web interfaces</strong></summary>

**Verify:**

- Services are running: `docker-compose ps`
- Ports are not blocked by firewall
- Use correct credentials from the table above
- Try `127.0.0.1` instead of `localhost`
</details>

<details>
<summary><strong>🗄️ Database connection issues</strong></summary>

**From your application:**

- Use Docker service names (`postgres`, `mongo`, `redis`)
- Don't use `localhost` when connecting from containers
- Check credentials match your `.env` file
</details>

## 💡 Development Tips

### Connecting from Your Application

```javascript
// ✅ Correct - Use service names for inter-container communication
const dbConfig = {
  host: "postgres", // Not 'localhost'!
  port: 5432,
  user: "devuser",
  password: "devpass",
};

// ✅ For external connections (from your IDE, etc.)
const externalConfig = {
  host: "localhost", // or '127.0.0.1'
  port: 5432,
  user: "devuser",
  password: "devpass",
};
```

### Service Discovery

All services are accessible by their container names:

- `postgres` - PostgreSQL database
- `mongo` - MongoDB database
- `redis` - Redis cache
- `minio` - MinIO S3 storage
- `rabbitmq` - Message queue
- `loki` - Log aggregation

## 📄 Important Notes

- **🚧 Development Only**: This setup is for local development, not production
- **🔒 Security**: Change default passwords for production-like testing
- **🌐 Networking**: All services run on Docker's internal network
- **💾 Data Persistence**: Data is preserved between container restarts
- **🔄 Fresh Start**: Use `docker-compose down -v` to reset all data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⭐ Found this helpful?** Give it a star and share with your team!
