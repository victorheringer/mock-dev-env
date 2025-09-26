// services/rabbitmq.js
import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export async function createTestRabbitMQ() {
  const host = process.env.RABBITMQ_HOST;
  const port = process.env.RABBITMQ_PORT;
  const user = process.env.RABBITMQ_USER;
  const pass = process.env.RABBITMQ_PASS;
  const queue = process.env.RABBITMQ_QUEUE;

  const url = `amqp://${user}:${pass}@${host}:${port}`;

  let connection;
  try {
    connection = await amqplib.connect(url);
    console.log("Connected to RabbitMQ");

    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });

    const message = JSON.stringify({
      text: "Hello RabbitMQ",
      ts: new Date().toISOString(),
    });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log("Message sent to queue:", queue, message);

    // consume one message (with a short timeout so test doesn't hang)
    const consumePromise = new Promise((resolve, reject) => {
      const onMessage = (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          console.log("Message received from queue:", content);
          channel.ack(msg);
          resolve(content);
        } else {
          resolve(null);
        }
      };

      channel.consume(queue, onMessage, { noAck: false }).catch(reject);

      // safety timeout: if nothing is consumed in X ms, resolve anyway
      setTimeout(() => resolve(null), 3000);
    });

    const received = await consumePromise;
    if (!received)
      console.log(
        "No message consumed within timeout (this can happen in some race conditions)."
      );

    await channel.close();
  } catch (err) {
    console.error("RabbitMQ test error:", err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        /* ignore */
      }
    }
    console.log("RabbitMQ test finished");
  }
}
