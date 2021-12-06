const express = require ('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "0213213": "www.lighthouselabs.ca",
  "1213213": "www.google.com"
};

app.set('view engine', 'ejs')

app.get("/", (req, res,) => {
  res.send("Welcome to Tinyapp");
});

app.get ('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.listen(PORT, () => {
  console.log(`Tinyapp is listening on port ${PORT}.`);
});