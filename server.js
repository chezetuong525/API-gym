const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const hfToken = process.env.HUGGINGFACE_API_KEY;

if (!hfToken) {
  console.error('Missing HUGGINGFACE_API_KEY in environment variables');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Convert messages (chat) -> text prompt
function buildPrompt(messages, fallbackInput) {
  if (!messages || !Array.isArray(messages)) {
    return fallbackInput;
  }

  return messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');
}

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Hugging Face proxy API đang hoạt động',
    endpoints: {
      health: '/health',
      inference: '/api/hf'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main API
app.post('/api/hf', async (req, res) => {
  const { model, inputs, parameters, messages } = req.body;

  if (!model) {
    return res.status(400).json({
      error: 'Thiếu model'
    });
  }

  try {
    // Nếu có messages → convert thành text
    const finalInput = buildPrompt(messages, inputs);

    if (!finalInput) {
      return res.status(400).json({
        error: 'Thiếu inputs hoặc messages'
      });
    }

   

console.log("Calling HF:", url);

const response = await axios.post(
  "https://router.huggingface.co/v1/chat/completions",
  {
    model: model,
    messages: [
      { role: "user", content: finalInput }
    ],
    temperature: parameters?.temperature ?? 0.7,
    top_p: parameters?.top_p ?? 0.9
  },
  {
    headers: {
      Authorization: `Bearer ${hfToken}`,
      "Content-Type": "application/json"
    },
    timeout: 120000
  }
);

    res.json(response.data);

  } catch (error) {
    console.error('HF ERROR DETAIL:', error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: 'HuggingFace API error',
        detail: error.response.data
      });
    }

    res.status(500).json({
      error: 'Server error',
      detail: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Hugging Face proxy API running on port ${port}`);
});