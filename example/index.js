import { createRegisterPostgres } from "./services/postgres.js";
import { createRegisterMongo } from "./services/mongo.js";
import { createRegisterRedis } from "./services/redis.js";
import { sendEmail } from "./services/mail.js";
import { createFileMinio } from "./services/minio.js";

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

  console.log("\nAll tests completed!");
}

main();
