const PG = require("pg");

function findUser(email, password){//remplacer par la requête dans la base de données
  const client = new PG.Client();
  client.connect();
  return client.query(
  "SELECT * FROM users WHERE email = $1::text AND password = $2::text",
  [email, password])
    .then(result => {
      client.end();
      return result.rows[0];
    })
    .catch(error => {
      client.end();
      console.log(error);
    } )
  ;
}

function findUserByEmail(email){
  const client = new PG.Client();
  client.connect();
  return client.query(
  "SELECT * FROM users WHERE email = $1::text",
  [email])
    .then(result => {
      client.end();
      return result.rows[0];
    })
    .catch(error => {
      console.log(error);
      client.end();
    } )
  ;
}

function findUserById(id){
  const client = new PG.Client();
  client.connect();
  return client.query(
  "SELECT * FROM users WHERE id = $1",
  [id])
    .then(result => {
      client.end();
      return result.rows[0];
    })
    .catch(error => {
      console.log(error);
      client.end();
    })
  ;
}

module.exports = {
  findUser: findUser,
  findUserByEmail: findUserByEmail,
  findUserById: findUserById
};
