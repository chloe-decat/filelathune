const myUser = {
  email: "fabien.lebas@decathlon.com",
  password: "1234",
  displayName: "Fabien"
};

const userError = {
  displayName: "User error"
};

function findUser(email, password){//remplacer par la requête dans la base de données
  return new Promise((resolve, reject) => {
    if (email === myUser.email && password === myUser.password){
      resolve(myUser);
    } else {
      reject("could not log");
    }
  });
}

function findUserByEmail(email){
  return new Promise((resolve, reject) => {
    if (email === myUser.email){
      resolve(myUser);
    } else {
      reject("could not log");
    }
  });
}

module.exports = {
  findUser: findUser,
  findUserByEmail: findUserByEmail
};
