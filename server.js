const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Your GitHub OAuth App credentials
const CLIENT_ID = 'Ov23lixgp8EnYR4VkrMm';
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET; // Set this in your environment variables

app.use(cors());
app.use(express.json());

// OAuth callback endpoint
app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Redirect back to extension with token
      // You can redirect to a success page or directly back to the extension
      res.redirect(`chrome-extension://YOUR_EXTENSION_ID/redirect.html?token=${tokenData.access_token}`);
    } else {
      res.status(400).send('Failed to get access token');
    }
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Internal server error');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});