import { Client } from "minio";
import dotenv from "dotenv";
dotenv.config();

export async function criarArquivoMinio() {
  const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });

  const bucket = process.env.MINIO_BUCKET;

  const exists = await minioClient.bucketExists(bucket).catch(() => false);
  if (!exists) await minioClient.makeBucket(bucket, "us-east-1");

  await minioClient.putObject(bucket, "test.txt", "Hello MinIO!");
  console.log("File created in MinIO in bucket:", bucket);
}
