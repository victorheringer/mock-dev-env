import { createRegisterPostgres } from "./services/postgres.js";
import { createRegisterMongo } from "./services/mongo.js";
import { createRegisterRedis } from "./services/redis.js";
import { sendEmail } from "./services/mail.js";
import { createFileMinio } from "./services/minio.js";
import { createTestRabbitMQ } from "./services/rabbitmq.js";
import { sendTestLogLoki } from "./services/loki.js";
import { createRegisterSQLite } from "./services/sqlite.js";
import { sendTestWebhook } from "./services/ultrahook.js";

async function main() {
  console.log("=== Testing PostgreSQL ===");
  await createRegisterPostgres();

  console.log("\n=== Testing MongoDB ===");
  await createRegisterMongo();

  console.log("\n=== Testing Redis ===");
  await createRegisterRedis();

  console.log("\n=== Testing MailCatcher ===");
  await sendEmail();

  console.log("\n=== Testing MinIO ===");
  await createFileMinio();

  console.log("\n=== Testing RabbitMQ ===");
  await createTestRabbitMQ();

  console.log("\n=== Testing Grafana/Loki ===");
  await sendTestLogLoki();

  console.log("\n=== Testing SQLite ===");
  await createRegisterSQLite();

  console.log("\n=== Testing Ultrahook ===");
  await sendTestWebhook();

  console.log("\nAll tests completed!");
}

main();
