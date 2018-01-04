const PG = require("pg");

const myUser = {
  email: "fabien.lebas@decathlon.com",
  password: "1234",
  displayName: "Fabien"
};

function findUser(email, password){//remplacer par la requête dans la base de données
  const client = new PG.Client();
  client.connect();
  client.query(
  "SELECT * FROM users WHERE email = $1::text AND password = $2::text",
  [email, password],
  function(error, result) {
    if (error) {
      console.warn(error);
    } else {
      console.log("user found " + result.rows[0]);
      return(result.rows[0]);
    }
    client.end();
  }
  );
  //
  // return new Promise((resolve, reject) => {
  //   if (email === myUser.email && password === myUser.password){
  //     resolve(myUser);
  //   } else {
  //     reject("Erreur login ou mot de passe");
  //   }
  // });
}

function findUserByEmail(email){
  const client = new PG.Client();
  client.connect();
  client.query(
  "SELECT * FROM users WHERE email = $1::text",
  [email],
  function(error, result) {
    if (error) {
      console.warn(error);
    } else {
      console.log("user found " + email);
      return(result.rows[0]);
    }
    client.end();
  }
  );
  // return new Promise((resolve, reject) => {
  //   if (email === myUser.email){
  //     resolve(myUser);
  //   } else {
  //     reject("Erreur login ou mot de passe");
  //   }
  // });
}

module.exports = {
  findUser: findUser,
  findUserByEmail: findUserByEmail
};
