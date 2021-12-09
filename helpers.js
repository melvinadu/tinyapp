//HELPER FUNCTIONS

const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6)
};

// old helper function
// const findUserByEmail = function(email) {
//   for (let randomUserID in users) {
//     if (email === users[randomUserID].email) {
//       return users[randomUserID];
//     }
//   }
// };

const findUserByEmail = function(email, database) {
  for (let randomUserID in database) {
    if (email === database[randomUserID].email) {
      return database[randomUserID];
    }
  }
};

const authenticateUser = function(email, password) {
  //retrieve the user with that email
  const user = findUserByEmail(email, users);

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

module.exports = {
  generateRandomString, 
  findUserByEmail, 
  authenticateUser
}