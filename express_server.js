const express = require ('express');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
    return Math.random().toString(20).substr(2, 6)
};

app.set('view engine', 'ejs')

app.listen(PORT, () => {
  console.log(`Tinyapp is listening on port ${PORT}.`);
});

app.get("/", (req, res,) => {
  res.send("Welcome to Tinyapp");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  //What would happen if a client requests a non-existent shortURL?
  if (!urlDatabase[shortURL]) {
    res.send('<html><body>Error</body></html>\n');
    return;
  }
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let newID = generateRandomString();
  urlDatabase[newID] = req.body.longURL;
  res.redirect(`/urls/${newID}`);         // Respond redirect
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


/*
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send('Ok');
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
*/