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

function getCurrentActivityName(idActivity){
  const client = new PG.Client();
  client.connect();
  return client.query(
    `SELECT name FROM activities WHERE id=$1`,
    [`${idActivity}`]
  )
  .then(result => {
    client.end();
    return result.rows[0].name;
  })
}

function insertIntoExpenses(name,description,amount,uuid, idActivity){
  const client = new PG.Client();
  client.connect();
  return client.query(
    " INSERT INTO expenses(id, name, description,creation_time,modification_time, activity_id) values ($1,$2,$3,$4,$5,$6) returning id",
    [uuid,name,description,'now()','now()',idActivity]
  )
  .then(result => {
    client.end();
    return result;
  })
}

function insertIntoUsersExpenses(uuid){
  const client = new PG.Client();
  client.connect();
  client.query(
    " INSERT INTO users_expenses(user_id, expense_id) values ($1,$2)",
    ['081a68ec-8556-44ef-8509-65fea0717b0b',uuid]
  )
  .then(result => {
    client.end();
    return result;
  })
}

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
getCurrentActivityName:getCurrentActivityName,
insertUser: insertUser,
insertIntoUsersExpenses:insertIntoUsersExpenses,
insertIntoExpenses:insertIntoExpenses
}
