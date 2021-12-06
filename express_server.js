const express = require ('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "0": "www.lighthouselabs.ca",
  "1": "www.google.com"
};

app.get("/", (req, res,) => {
  res.send("Welcome to Tinyapp");
});

app.get ('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

app.listen(PORT, () => {
  console.log(`Tinyapp is listening on port ${PORT}.`);
});