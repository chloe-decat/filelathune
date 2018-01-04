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

module.exports = {
  insertUser: insertUser
};
