import dotenv from "dotenv";
dotenv.config();

export async function sendTestLogLoki() {
  const lokiUrl = `http://${process.env.LOKI_HOST}:${process.env.LOKI_PORT}/loki/api/v1/push`;

  const logPayload = {
    streams: [
      {
        stream: { service: "test-service", env: "dev" },
        values: [
          [
            `${Date.now() * 1000000}`, // timestamp em nanossegundos
            "This is a new test log sent to Loki via fetch",
          ],
        ],
      },
    ],
  };

  const maxRetries = 5;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(lokiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Log sent to Loki at ${lokiUrl}`);
      break;
    } catch (error) {
      console.error(
        `Attempt ${attempt} failed to send log to Loki: ${error.message}`
      );
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        console.error("❌ All attempts failed. Check if Loki is running!");
      }
    }
  }
}
