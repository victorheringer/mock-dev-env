import express from "express";
const app = express();
app.use(express.json());

app.post("/webhook-test", (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("OK");
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Webhook server running on http://localhost:${PORT}`)
);
