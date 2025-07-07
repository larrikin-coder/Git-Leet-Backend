// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const EXTENSION_ID = process.env.EXTENSION_ID;
const app = express();
app.use(cors());

app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;

  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  const access_token = tokenRes.data.access_token;
  res.redirect(
    `https://${EXTENSION_ID}.chromiumapp.org?token=${access_token}`
  );
});

app.listen(3000, () =>
  console.log("OAuth backend")
);
