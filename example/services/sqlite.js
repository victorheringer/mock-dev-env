import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import { mkdirSync } from "fs";
import path from "path";
dotenv.config();

export async function createRegisterSQLite() {
  // Ensure data directory exists
  const dbPath = process.env.SQLITE_DB_PATH || "./data/devdb.sqlite";
  const dbDir = path.dirname(dbPath);

  try {
    mkdirSync(dbDir, { recursive: true });
  } catch (err) {
    // Directory might already exist, ignore error
  }

  // Open database connection
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  console.log("Connected to SQLite");

  // Create table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert test data
  const result = await db.run("INSERT INTO test (name) VALUES (?)", ["Person"]);
  console.log("Record inserted into SQLite with ID:", result.lastID);

  // Query data
  const rows = await db.all("SELECT * FROM test");
  console.log("SQLite Data:", rows);

  // Close connection
  await db.close();
}
