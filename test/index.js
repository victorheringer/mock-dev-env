import { criarRegistroPostgres } from "./services/postgres.js";
import { criarRegistroMongo } from "./services/mongo.js";
import { criarChaveRedis } from "./services/redis.js";
import { enviarEmail } from "./services/mail.js";
import { criarArquivoMinio } from "./services/minio.js";

async function main() {
  console.log("=== Testing PostgreSQL ===");
  await criarRegistroPostgres();

  console.log("\n=== Testing MongoDB ===");
  await criarRegistroMongo();

  console.log("\n=== Testing Redis ===");
  await criarChaveRedis();

  console.log("\n=== Testing MailCatcher ===");
  await enviarEmail();

  console.log("\n=== Testing MinIO ===");
  await criarArquivoMinio();

  console.log("\nAll tests completed!");
}

main();
