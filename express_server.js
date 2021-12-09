const express = require ('express');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

const bcrypt = require('bcryptjs');
const e = require('express');
const salt = bcrypt.genSaltSync(10);

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

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

function urlsForUser(pid) {
  const subset = {};

  for (const id in urlDatabase) {
    if (urlDatabase[id].userID === pid) {
      subset[id] = urlDatabase[id];
    }
  }
  return subset;
}

function authenticateUser(email, password) {
  //retrieve the user with that email
  const user = findUserByEmail(email);

  //if we got a user bacj and the passwords match then return userObj
    // if (user && user.password === password) Old method previous to hashing password
  if (user && bcrypt.compareSync(password, user.password)) {
    //user is authenticated
    return user;
  } else {
    //otherwise return false 
    return false;
  }
};

// Old database structure
// const urlDatabase = {
//   b2xVn2:  "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcrypt.hashSync('purple-monkey-dinosaur', salt)
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcrypt.hashSync('dishwasher-funk', salt)
  },
  e1cb87: { id: 'e1cb87', email: '123@example.com', password: bcrypt.hashSync('123', salt) }
};

app.set('view engine', 'ejs')

// app.get('/', function (req, res) {
//   // Cookies that have not been signed
//   console.log('Cookies: ', req.cookies)
 
// });

app.get("/", (req, res,) => {
  res.send("Welcome to Tinyapp! Please register or log in to continue!");

});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req,res) => {
  const user = users[req.session["user_id"]];
  const templateVars = { 
    urls: urlsForUser(users.id), 
    user: user
  };

  // if user is not logged in, send error message
  if (!user) {
    res.send('<html><body>Error: Please log in before trying to access your URLs. </body></html>\n');
    return;  
  }

  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]];
  const templateVars = { 
    user: user
  }
// if user is not logged in, redirect to login page
  if (!user) {
    res.redirect(`/urls/login`);
  }
  res.render("urls_new", templateVars);
});

//GET response for register page 
app.get("/urls/register", (req, res) => {
  const user = users[req.session["user_id"]];

  const templateVars = { 
    user: user
  };
//if logged in, user trying to access register page is redirected to home page
  if (user) {
    res.redirect(`/urls`);
  }

  res.render("urls_register", templateVars);
});

//GET response get login page
app.get("/urls/login", (req, res) => {
  const user = users[req.session["user_id"]];

  const templateVars = { 
    user: user
  };
//if logged in, user trying to access login page is redirected to home page
  if (user) {
    res.redirect(`/urls`);
  }

  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session["user_id"]];
  
  const shortURL = req.params.shortURL;
  //What would happen if a client requests a non-existent shortURL?
  if (!urlDatabase[shortURL]) {
    res.send('<html><body>Error: you are trying to access a non-existent shortURL </body></html>\n');
    return;
  }

  if (!user) {
    return res.status(400).send("Login first!")
  }

  if (urlDatabase[req.params.shortURL].userID === users.id) {
  const templateVars = { 
    shortURL: shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: user
  };
  res.render("urls_show", templateVars);
  } else {
    res.send('<html><body>Error: You are trying to access a page you do not own!</body></html>\n');
    return;
  }


});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  //What would happen if a client requests a non-existent shortURL?
  if (!urlDatabase[shortURL]) {
    res.send('<html><body>Error: you are trying to access a non-existent shortURL </body></html>\n');
    return;
  }

  const longURL = urlDatabase[req.params.shortURL].longURL;

  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  
  if (!user) {
    res.send('<html><body>Error: You must log in before added any new URLs! </body></html>\n');
    return;
  }

  console.log(req.body);  // Log the POST request body to the console
  let newID = generateRandomString();
  console.log(newID);

//updating the new database with the newly generated long URL
  urlDatabase[newID] = {
    longURL: req.body.longURL,   //another attempt that did not work: urlDatabase[newID]["longURL"] = req.body.longURL;
    userID: users.id   //another attempt that did not work: urlDatabase[newID]["userID"] = user.id;
  };
  

  console.log(urlDatabase);
  
  res.redirect(`/urls/${newID}`);     // Respond redirect to new ID page
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session["user_id"]];

  if (!user) {
    return res.status(400).send("Login first!")
  }

  if (urlDatabase[req.params.shortURL].userID === users.id) {
    const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);           // Respond redirect to index page

  } else {
    res.status(401).send("You do not own this page");
  }


});

app.post("/urls/:id", (req, res) => {
  
  const user = users[req.session["user_id"]];

  if (!user) {
    return res.status(400).send("Login first!")
  }

  if (urlDatabase[req.params.id].userID === users.id) {
    const id = req.params.id;
    urlDatabase[id].longURL = req.body.longURL;

    res.redirect(`/urls/${id}`);           // Respond redirect to index page

  } else {
    res.status(401).send("You do not own this page");
  }

});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  
  const userObject = authenticateUser(email, password);
 
  if (!userObject) {
    res.statusCode = 403;
    res.send('<html><body>Invalid email or password!!</body></html>\n');
    return;
  }
  
  // res.cookie("user_id", username); // old cookie method
  // res.cookie("user_id", userObject.id);
  req.session["user_id"] = userObject.id;


  res.redirect(`/urls`);         // Respond redirect to index page
});

app.post("/logout", (req, res) => {

  // res.clearCookie("user_id")
  req.session["user_id"] = null;

  res.redirect(`/`);         // Respond redirect to index page
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
    password: bcrypt.hashSync(req.body.password, salt)
  };

  // res.cookie("user_id", users[newID].id);
  req.session["user_id"] = users[newID].id;

  console.log(users);

  res.redirect(`/urls`);         // Respond redirect to index page
});

app.listen(PORT, () => {
  console.log(`Tinyapp is listening on port ${PORT}.`);
});

