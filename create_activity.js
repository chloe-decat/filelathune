const request = require("request");
const PG = require("pg");


function exportActivity(uuid, startdate, description, titre) {
  const client = new PG.Client();
  client.connect();
  return client.query(
    "INSERT INTO activities (id, start_date, description, creation_time, modification_time, name) VALUES ($1, $2, $3, $4, $5, $6)",
    [uuid, startdate, description,'now()','now()',titre]
    )
  .then(insertIntoUsersActivities => {
    client.connect();
    return client.query(
      "INSERT INTO users-activities (user_id, activity_id) VALUES ($1, $2)",
      [username, uuid]
    )
  });
  .catch(error => {
    console.warn(error);
    }
  );
  client.end();
}


module.exports = {
exportActivity : exportActivity
}
