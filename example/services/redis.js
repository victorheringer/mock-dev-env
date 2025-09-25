import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export async function createRegisterRedis() {
  const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  console.log("Connected to Redis");

  await client.set("test", "value123");
  const valor = await client.get("teste");
  console.log("Redis Value:", valor);

  await client.disconnect();
}
