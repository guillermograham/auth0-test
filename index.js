require('dotenv').config();

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

const audience = process.env.AUTH0_AUDIENCE;
const client_id = process.env.AUTH0_CLIENT_ID;
const client_secret = process.env.AUTH0_CLIENT_SECRET;
const connection = process.env.AUTH0_CONNECTION;
const domain = process.env.AUTH0_DOMAIN;

app.use(bodyParser());

app.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      throw new Error('Missing required data');

    const url = `https://${domain}/dbconnections/signup`;
    const payload = {
      client_id,
      connection,
      email,
      password,
      username,
    };

    const newUser = await axios.post(url, payload);
    const { data } = newUser;

    res.json(data);
  } catch (error) {
    const message = error.message;

    res.json({ error: JSON.stringify(error), message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { password, username } = req.body;
    if (password || !username) throw new Error('Missing required data');

    const url = `https://${domain}/oauth/token`;
    const payload = {
      grant_type: 'password',
      username,
      password,
      audience,
      connection,
      client_id,
      client_secret,
    };

    const { data } = await axios.post(url, payload);
    res.json(data);
  } catch (error) {
    console.error(error);

    const message = error.message;

    res.json({ error: JSON.stringify(error), message });
  }
});

app.listen(3000, () => {
  console.log(`🚀  API ready at http://localhost:3000`);
});
