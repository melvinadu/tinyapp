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


module.exports = {
  generateRandomString, 
  findUserByEmail
}