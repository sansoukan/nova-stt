import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 10000;

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Nova STT server up & running");
});

const server = app.listen(PORT, () => {
  console.log(`🟦 STT listening on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🟦 Client connected");

  ws.on("message", (msg) => {
    const text = msg.toString();

    ws.send(JSON.stringify({
      type: "response.output_text.delta",
      text
    }));

    ws.send(JSON.stringify({
      type: "input_audio_buffer.append"
    }));

    ws.send(JSON.stringify({
      type: "response.completed"
    }));
  });

  ws.on("close", () => console.log("🟦 Client disconnected"));
});
