import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";
dotenv.config();

export async function criarRegistroPostgres() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  await client.connect();
  console.log("Connected to PostgreSQL");

  await client.query(`
    CREATE TABLE IF NOT EXISTS test (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50)
    )
  `);

  await client.query("INSERT INTO test (name) VALUES ($1)", ["Person"]);
  console.log("Record inserted into PostgreSQL");

  const res = await client.query("SELECT * FROM test");
  console.log("PostgreSQL Data:", res.rows);

  await client.end();
}
