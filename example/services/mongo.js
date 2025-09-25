import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export async function createRegisterMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db("test");
  const collection = db.collection("users-test");

  await collection.insertOne({ name: "Person", age: 32 });
  const result = await collection.find({}).toArray();

  console.log("MongoDB Data:", result);
  await client.close();
}
