import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sourceLanguage = process.env.SOURCE_LANGUAGE;
const targetLanguage = process.env.TARGET_LANGUAGE;

const prompt = `You are a translation engine. You translate from ${sourceLanguage} to ${targetLanguage}. Try to avoid translating what seems to be names or placenames and just return them as-is. Only reply with the translated text, no explanations.`;


app.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "Missing 'text' or 'targetLanguage'" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: text,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const translated = response.data.choices[0].message.content.trim();
    res.json({ translation: translated });
  } catch (err) {
    console.error("Translation error:", err.response?.data || err.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Translation proxy running on port ${PORT}`));
