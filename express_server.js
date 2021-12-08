const express = require ('express');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

function generateRandomString() {
  return Math.random().toString(20).substr(2, 6)
};

function findUserByEmail(email) {
  for (let randomUserID in users) {
    if (email === users[randomUserID].email) {
      return users[randomUserID];
    }
  }
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  },
  e1cb87: { id: 'e1cb87', email: '123@example.com', password: '123' }
};

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
 
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
  const user = users[req.cookies["user_id"]];
  const templateVars = { 
    urls: urlDatabase, 
    user: user
};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { 
    user: user
  }
  res.render("urls_new", templateVars);
});

//GET response for register page 
app.get("/urls/register", (req, res) => {
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };

  if (user) {
    res.redirect(`/urls`);
  }

  res.render("urls_register", templateVars);
});

//GET response get login page
app.get("/urls/login", (req, res) => {
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };

  if (user) {
    res.redirect(`/urls`);
  }

  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];

  const shortURL = req.params.shortURL;
  //What would happen if a client requests a non-existent shortURL?
  if (!urlDatabase[shortURL]) {
    res.send('<html><body>Error: you are trying to access a non-existent page </body></html>\n');
    return;
  }
  const templateVars = { 
    shortURL: shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: user
  };
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let newID = generateRandomString();
  urlDatabase[newID] = req.body.longURL;

  res.redirect(`/urls/${newID}`);     // Respond redirect to new ID page
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);         // Respond redirect to index page
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;

  res.redirect(`/urls`);         // Respond redirect to index page
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  const userObject = findUserByEmail(email);
  
  if (password !== userObject.password) {
    res.statusCode = 403;
    res.send('<html><body>Invalid email or password!!</body></html>\n');
    return;
  }

  if (!userObject) {
    res.statusCode = 403;
    res.send('<html><body>Invalid email or password!!</body></html>\n');
    return;
  }


  // res.cookie("user_id", username); // old cookie method
  res.cookie("user_id", userObject.id);

  res.redirect(`/urls`);         // Respond redirect to index page
});

app.post("/logout", (req, res) => {

  res.clearCookie("user_id")

  res.redirect(`/urls`);         // Respond redirect to index page
});

//POST response to handle incoming account creation
app.post("/register", (req, res) => {
  
  if ((!req.body.email) || (!req.body.password)) {
    res.statusCode = 400;
    res.send('<html><body>Email or Password is empty. Please enter an email and password!</body></html>\n');
    return;
  }


  for (let element in users) {
    if (req.body.email === users[element].email) {
      res.send('<html><body>Email address is already in use</body></html>\n');
    return;
    }
  }

  let newID = generateRandomString();

  users[newID] = {
    id: `${newID}`,
    email: req.body.email,
    password: req.body.password
  };

  res.cookie("user_id", users[newID].id);

  console.log(users);

  res.redirect(`/urls`);         // Respond redirect to index page
});

app.listen(PORT, () => {
  console.log(`Tinyapp is listening on port ${PORT}.`);
});

