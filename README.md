# Mock Development Environment

[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2.0+-blue.svg)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🐳 **Complete Docker-based development environment** with 9+ pre-configured services for modern web development

**Mock Development Environment** is a carefully crafted development stack that prioritizes **developer experience** and **rapid prototyping**. It provides instant access to essential services with visual management interfaces, enabling you to build and test integrations without complex infrastructure setup.

**Key Philosophy:** Create service abstractions that work identically in development and production, allowing seamless transitions from local development to deployed applications.

**⚡ Quick Start in 30 seconds:**

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

⚠️ **Before Starting:** The environment works out-of-the-box for most services, but **Ultrahook requires your own credentials**. If you don't need webhook testing, you can ignore the Ultrahook service. You can change this by editing your Ultrahook variables in your `.env` file.

💾 **SQLite Data:** The SQLite service uses `./example/data` as the default data directory. You can change this by editing `SQLITE_DATA_PATH` in your `.env` file.

✅ **That's it!** All services are now running and accessible.

## 📊 Services Overview

### 🛠️ Core Services

| Service           | Host Port | Container Port | Credentials          | Purpose               |
| ----------------- | --------- | -------------- | -------------------- | --------------------- |
| 🐘 **PostgreSQL** | 5432      | 5432           | `devuser/devpass`    | Relational database   |
| 🍃 **MongoDB**    | 27017     | 27017          | `devuser/devpass`    | Document database     |
| 🔴 **Redis**      | 6379      | 6379           | No auth              | Cache & sessions      |
| 📦 **MinIO API**  | 9000      | 9000           | `devuser/devpass123` | S3-compatible storage |
| � **MailCatcher** | 1025      | 1025           | No auth              | SMTP server           |
| 🐰 **RabbitMQ**   | 5672      | 5672           | `devuser/devpass`    | Message broker        |
| � **Loki**        | 3100      | 3100           | No auth              | Log aggregation       |
| 🌐 **Ultrahook**  | 5000      | 5000           | Your credentials     | Webhook tunnel        |

### 🎛️ Web Management Interfaces

| Interface              | URL                                       | Host Port | Container Port | Credentials           | Purpose           |
| ---------------------- | ----------------------------------------- | --------- | -------------- | --------------------- | ----------------- |
| � **pgAdmin**          | [localhost:5050](http://localhost:5050)   | 5050      | 80             | `admin@dev.com/admin` | PostgreSQL admin  |
| 🌐 **Mongo Express**   | [localhost:8081](http://localhost:8081)   | 8081      | 8081           | `devuser/devpass`     | MongoDB admin     |
| ⚡ **Redis Commander** | [localhost:8082](http://localhost:8082)   | 8082      | 8081           | `admin/admin`         | Redis admin       |
| 📦 **MinIO Console**   | [localhost:9001](http://localhost:9001)   | 9001      | 9001           | `devuser/devpass123`  | S3 web interface  |
| � **MailCatcher UI**   | [localhost:1080](http://localhost:1080)   | 1080      | 1080           | No auth               | Email testing     |
| � **RabbitMQ Mgmt**    | [localhost:15672](http://localhost:15672) | 15672     | 15672          | `devuser/devpass`     | Queue management  |
| 📈 **Grafana**         | [localhost:3000](http://localhost:3000)   | 3000      | 3000           | `admin/admin`         | Monitoring & logs |
| 🗃️ **SQLite Web**      | [localhost:8083](http://localhost:8083)   | 8083      | 8080           | No auth               | SQLite admin      |

## 📁 Project Structure

```
mock-dev-env/
├─ docker-compose.yml
├─ .env-example          # Template with default values
├─ minio/
├─ example/              # Example Node.js services and webhook server
│  ├─ services/          # Individual service test files
│  ├─ server.js          # Webhook receiver server (port 3001)
│  ├─ index.js           # Test runner for all services
│  └─ package.json       # Dependencies for examples
```

Optional files:

- postgres/init.sql → create initial tables/data in Postgres
- minio/config.json → configure buckets in MinIO

### 🔧 Custom Configuration

```bash
# Ultrahook - Required for webhook functionality
ULTRAHOOK_NAMESPACE=your-namespace-here
ULTRAHOOK_API_KEY=your-api-key-here

# SQLite - Configure data directory path
SQLITE_DATA_PATH=./example/data  # Default: uses existing example data
```

**Ultrahook Setup** (for webhook testing):

1. Sign up at [ultrahook.com](https://www.ultrahook.com)
2. Get your API key from the dashboard
3. Choose a unique namespace
4. Update the values in your `.env` file

## ⚡ Makefile Commands

This project includes a powerful Makefile for easy container management with support for multiple development contexts.

### 📋 Quick Reference

```bash
# Show all available commands
make help

# Start all containers
make up-all

# Stop all containers
make down-all

# View container status
make ps
```

### 🎯 Context-Based Management

Define container groups for different development scenarios in your `.env` file:

```bash
# Example contexts in .env
SELECTED_CONTAINERS_DB=dev_postgres,dev_pgadmin,dev_mongo,dev_mongo_express
SELECTED_CONTAINERS_CACHE=dev_redis,dev_redis_commander,dev_rabbitmq
SELECTED_CONTAINERS_MY_CONTEXT=dev_pgadmin,dev_mongo,dev_mongo_express
```

**Use contexts to start only what you need:**

```bash
# Start containers for a specific context
make up my_context      # Starts: dev_pgadmin, dev_mongo, dev_mongo_express
make up db              # Starts: dev_postgres, dev_pgadmin, dev_mongo, dev_mongo_express
make up cache           # Starts: dev_redis, dev_redis_commander, dev_rabbitmq

# Stop containers from a context
make down my_context

# Restart containers in a context
make restart db

# View logs for a context
make logs cache
```

### 📚 All Available Commands

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `make help`              | Show help with all available commands              |
| `make up <context>`      | Start containers defined in a specific context     |
| `make down <context>`    | Stop containers from a specific context            |
| `make restart <context>` | Restart containers in a specific context           |
| `make logs <context>`    | Show logs for containers in a specific context     |
| `make up-all`            | Start all containers defined in docker-compose.yml |
| `make down-all`          | Stop all containers                                |
| `make restart-all`       | Restart all containers                             |
| `make stop-all`          | Stop all containers without removing them          |
| `make start-all`         | Start all previously stopped containers            |
| `make ps`                | List running containers                            |
| `make status`            | Show detailed status of all containers             |
| `make logs-all`          | Show logs from all containers                      |
| `make pull`              | Update all Docker images                           |
| `make clean`             | Remove containers, volumes and networks ⚠️         |
| `make clean-images`      | Remove containers, volumes, networks and images ⚠️ |

### 💡 Context Configuration Examples

Add these to your `.env` file to create custom development contexts:

```bash
# Database development
SELECTED_CONTAINERS_DB=dev_postgres,dev_pgadmin,dev_mongo,dev_mongo_express

# Cache and message queue development
SELECTED_CONTAINERS_CACHE=dev_redis,dev_redis_commander,dev_rabbitmq

# Storage and email testing
SELECTED_CONTAINERS_STORAGE=dev_minio,dev_minio_client,dev_mailcatcher

# Monitoring stack
SELECTED_CONTAINERS_MONITORING=dev_loki,dev_grafana

# Minimal setup for quick tests
SELECTED_CONTAINERS_MINIMAL=dev_postgres,dev_redis

# Full web development stack
SELECTED_CONTAINERS_WEB=dev_postgres,dev_redis,dev_mailcatcher,dev_minio
```

### 🔍 Useful Docker Commands

```bash
# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f postgres

# Execute commands in a container
docker exec -it dev_postgres psql -U devuser -d devdb
docker exec -it dev_redis redis-cli
docker exec -it dev_mongo mongosh -u devuser -p devpass

# Inspect container details
docker inspect dev_postgres
```

---

## 🎯 Project Motivation & Philosophy

### **Why Mock Development Environment?**

This project was created to solve a common development challenge: **easily integrating with multiple services during development** without the complexity of production infrastructure setup. It provides instant access to essential services with **visual management interfaces**, enabling developers to focus on building features rather than configuring infrastructure.

### **🚀 Core Objectives**

#### **1. Rapid Development Integration**

- **Instant Access**: Get databases, queues, storage, and monitoring tools running in seconds
- **Visual Interfaces**: Every service includes a web-based management interface for easy inspection and debugging
- **Zero Configuration**: Works out-of-the-box with sensible defaults, customizable when needed

#### **2. Development-Production Parity**

This environment encourages **abstraction patterns** that work seamlessly across development and production:

**Example: Email Service Integration**

```javascript
// 🏗️ Development Implementation
class DevEmailService {
  async send(email) {
    // Simple SMTP to MailCatcher - visible in web UI
    return nodemailer.send(email, { host: "mailcatcher", port: 1025 });
  }
}

// 🚀 Production Implementation
class ProdEmailService {
  async send(email) {
    // Real service SDK (SendGrid, AWS SES, etc.)
    return sendgrid.send(email);
  }
}

// 🔧 Usage (same interface, different implementations)
const emailService =
  process.env.NODE_ENV === "production"
    ? new ProdEmailService()
    : new DevEmailService();
```

#### **3. Service Exploration & Learning**

- **Hands-on Experience**: Interact with real services (PostgreSQL, MongoDB, Redis, etc.) through web interfaces
- **Safe Environment**: Experiment freely without affecting production systems
- **Complete Stack**: Experience how different services work together in a typical application

#### **What This Project IS:**

✅ **Development accelerator** - Get services running instantly  
✅ **Learning platform** - Explore technologies with visual interfaces  
✅ **Integration testing** - Test service interactions locally  
✅ **Prototype foundation** - Quick setup for MVPs and experiments

#### **What This Project IS NOT:**

❌ **Production infrastructure** - Not designed for production workloads  
❌ **Full orchestration solution** - No complex networking, load balancing, or scaling  
❌ **Production-grade security** - Uses development credentials and simple configurations  
❌ **Performance-optimized** - Prioritizes convenience over performance

#### **🌍 Platform Expected Migration Scenarios**

| Platform Type   | Examples                                 | Migration Complexity | Why It's Smooth                                   |
| --------------- | ---------------------------------------- | -------------------- | ------------------------------------------------- |
| **🟢 Simple**   | Railway, Render, DO Apps                 | Very Low             | Managed PostgreSQL/Redis work identically         |
| **🟡 Moderate** | Vercel + Supabase, Netlify + PlanetScale | Low                  | Same SQL patterns, enhanced with serverless       |
| **🟠 Advanced** | AWS, GCP, Azure                          | Medium               | Service abstractions provide clear migration path |

---

## � Advanced Configuration

> **💡 Quick Reference**: See the [Services Overview](#-services-overview) table for URLs, ports and basic credentials.

<details>
<summary><strong>🐘 PostgreSQL - Connection Details</strong></summary>

**Internal/External Hostnames:**

- External (from host): `localhost:5432`
- Internal (from containers): `postgres:5432`

**pgAdmin Setup:**

1. Create new server with hostname `postgres`, port `5432`
2. Use database credentials from Services Overview table

</details>

<details>
<summary><strong>🍃 MongoDB - Connection Strings</strong></summary>

```bash
# External connection (from host)
mongodb://devuser:devpass@localhost:27017

# Internal connection (from containers)
mongodb://devuser:devpass@mongo:27017
```

</details>

<details>
<summary><strong>🔴 Redis - CLI Access</strong></summary>

```bash
# Access Redis CLI
docker exec -it dev_redis redis-cli
```

</details>

<details>
<summary><strong>📦 MinIO - S3 SDK Configuration</strong></summary>

```javascript
// SDK configuration example
const s3Client = new S3Client({
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "devuser",
    secretAccessKey: "devpass123",
  },
  region: "us-east-1", // Required but can be any value
});
```

Default bucket: `test`

</details>

<details>
<summary><strong>📧 MailCatcher - SMTP Integration</strong></summary>

**For your applications:**

- SMTP Host: `mailcatcher` (from containers) or `localhost` (from host)
- SMTP Port: `1025`
- No authentication required

</details>

<details>
<summary><strong>🐰 RabbitMQ - Connection Details</strong></summary>

**Connection URLs:**

- External: `amqp://devuser:devpass@localhost:5672`
- Internal: `amqp://devuser:devpass@rabbitmq:5672`

Default queue: `test-queue`

</details>

<details>
<summary><strong>📈 Grafana - Loki Integration Setup</strong></summary>

**Configure Loki as Data Source:**

1. Go to **Configuration → Data Sources → Add Loki**
2. Set URL to: `http://loki:3100`
3. Save & Test

**Example LogQL Queries:**

```
{service="test-service", env="dev"}
{container="dev_postgres"} |= "error"
```

</details>

<details>
<summary><strong>🗃️ SQLite - Application Integration</strong></summary>

**Connection Examples:**

```javascript
// From host machine (development)
const dbPath = process.env.SQLITE_DATA_PATH + "/" + process.env.SQLITE_DB_NAME;

// From other containers
const dbPath = "/data/" + process.env.SQLITE_DB_NAME;
```

**CLI Access:**

```bash
docker exec -it dev_sqlite_web sqlite3 /data/devdb.sqlite
```

**Environment Variables:**

- `SQLITE_WEB_PORT=8083` - Web interface port
- `SQLITE_DB_NAME=devdb.sqlite` - Database filename
- `SQLITE_DATA_PATH=./example/data` - Data directory path

</details>

<details>
<summary><strong>🌐 Ultrahook - Webhook Testing Setup</strong></summary>

**After configuring your `.env` file:**

```bash
docker-compose restart ultrahook
```

Your tunnel will be available at: `http://your-namespace.ultrahook.com`

**Troubleshooting:**

- Verify credentials in `.env`
- Check logs: `docker logs dev_ultrahook`
- Test local endpoint first: `curl -X POST http://localhost:3001/webhook-test`

</details>

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
node -e "import('./services/sqlite.js').then(m => m.createRegisterSQLite())"
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

## 🤝 Contributing

1. Fork repo → Create branch → Add your service
2. Follow existing patterns and update documentation
3. Test integration → Submit PR with clear description

**Questions?** Open an issue to discuss ideas!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⭐ Found this helpful?** Give it a star and share with your team!

**💬 Have questions or suggestions?** Open an issue - we'd love to hear from you!
