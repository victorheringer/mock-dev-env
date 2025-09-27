import dotenv from "dotenv";
import https from "https";
import http from "http";
import { URL } from "url";
dotenv.config();

export async function sendTestWebhook() {
  const webhookUrl = process.env.ULTRAHOOK_WEBHOOK_URL;

  const payload = {
    event: "test_event",
    timestamp: new Date().toISOString(),
    message: "This is a test webhook sent via Ultrahook",
  };

  try {
    const url = new URL(webhookUrl);
    const isHttps = url.protocol === "https:";

    const postData = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        "X-Ultrahook-Api-Key": process.env.ULTRAHOOK_API_KEY,
      },
      // For development environments, ignore SSL certificate errors
      rejectUnauthorized: false,
    };

    const request = (isHttps ? https : http).request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          console.log(`✅ Webhook sent to ${webhookUrl}`);
          console.log(
            `📨 Response: ${response.statusCode} ${response.statusMessage}`
          );
        } else {
          console.error(`❌ HTTP error! status: ${response.statusCode}`);
        }
      });
    });

    request.on("error", (error) => {
      console.error("❌ Error sending webhook:", error.message);
      if (error.code === "ENOTFOUND") {
        console.error(
          "💡 DNS resolution failed. Check if the webhook URL hostname is correct."
        );
      } else if (error.code === "ECONNREFUSED") {
        console.error(
          "💡 Connection refused. Check if the webhook service is running."
        );
      } else if (
        error.code === "CERT_AUTHORITY_INVALID" ||
        error.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
      ) {
        console.error(
          "💡 SSL certificate validation failed. This is common in development environments."
        );
      }
    });

    request.write(postData);
    request.end();
  } catch (error) {
    console.error("❌ Error sending webhook:", error.message);
  }
}
