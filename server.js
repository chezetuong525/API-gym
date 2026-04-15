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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/hf', async (req, res) => {
  const { model, inputs, parameters, options } = req.body;

  if (!model || !inputs) {
    return res.status(400).json({
      error: 'Yêu cầu body có model và inputs, ví dụ { model, inputs, parameters? }'
    });
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs, parameters, options },
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Hugging Face request failed:', error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ error: 'Lỗi máy chủ khi gọi Hugging Face', detail: error.message });
  }
});

app.listen(port, () => {
  console.log(`Hugging Face proxy API running on port ${port}`);
});
