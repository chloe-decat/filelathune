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
function exportActivity(uuid, startdate, description, titre) {
  const client = new PG.Client();
  client.connect();
  return client.query(
    "INSERT INTO activities (id, start_date, description, creation_user_id, creation_time, modification_user_id, modification_time, name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning id",
    [uuid, startdate, description,'790f7abc-9afa-4d03-8fc1-be400254c720', 'now()','790f7abc-9afa-4d03-8fc1-be400254c720', 'now()',titre])
      .then(result => {
        client.end();
        return result;
      })
      .catch(error => console.log(error));
  }

  function insertIntoUsersActivities(uuid){
    const client = new PG.Client();
    client.connect();
    client.query(
      " INSERT INTO users_activities(user_id, activity_id) values ($1,$2)",
      ['790f7abc-9afa-4d03-8fc1-be400254c720',uuid]
    )
    .then(result => {
      client.end();
      return result;
    })
  }

module.exports = {
getCurrentActivityName:getCurrentActivityName,
insertUser: insertUser,
insertIntoUsersExpenses:insertIntoUsersExpenses,
insertIntoExpenses:insertIntoExpenses,
exportActivity:exportActivity,
insertIntoUsersActivities:insertIntoUsersActivities

}
