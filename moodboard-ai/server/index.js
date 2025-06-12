// server/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/flan", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-coder", // or just "deepseek" if you're using a different tag
        prompt: `Convert the following emoji or mood word to a mood keyword for image search:\n\n"${prompt}"\n\nReply with only the keyword.`,
        stream: false,
      }),
    });

    const data = await ollamaRes.json();
    const keyword = data.response.trim().replace(/["']/g, "");

    res.json({ output: keyword });
  } catch (err) {
    console.error("Ollama error:", err);
    res.status(500).json({ error: "Ollama server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
