const PG = require("pg");

function insertUser(name, email, password){
  const client = new PG.Client();
  client.connect();
  client.query(
  "INSERT INTO users (id, name, email, password) VALUES (uuid_generate_v4(), $1::text, $2::text, $3::text)",
  [name, email, password],
  function(error, result) {
    if (error) {
      console.warn(error);
    } else {
      console.log("insert OK");
      return(result);
    }
    client.end();
  }
  );
}



function findOrCreateUser(profile, callback){
  const facebook_id = profile.id;
  const facebook_name = profile.displayName;
  const client = new PG.Client();
  client.connect();

  return client.query(
    "SELECT EXISTS(SELECT facebook_id FROM users WHERE facebook_id=$1)",
    [facebook_id])
  .then(result => {
    if (result.rows[0].exists === true) {
      console.log(profile)
      callback(null, profile)
    } else {
      return client.query(
        "INSERT INTO users (id, facebook_id, name) VALUES (uuid_generate_v4(), $1::text, $2::text)",
        [facebook_id, facebook_name])
      .then(_ => {
        client.end();
        callback(null, profile);
      })
      .catch(error => {
        callback(error);
      })
    }
  })
  .catch(error => console.log(error))
}
// Rajouter le find sinon a chaque connexion, facebook va poster un utilisateur dans ma bdd voire erreur car l'id est supposé unique.

module.exports = {
  insertUser: insertUser,
  findOrCreateUser: findOrCreateUser
};
