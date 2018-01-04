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
  .then(result => result.rows[0].name)
}

function postExpense(newExpense,uuid){
  const client = new PG.Client();
  client.connect();
  console.log (newExpense);
  return client.query(
    text:`INSERT INTO activities(id, start_date, end_date, description, creation_user_id,creation_time, modification_user_id, modification_time)`,
    values:[`0e1a513c-891b-4d02-9082-f723e41177f1', '2017-01-01', '2017-06-01', 'Epiphanie + bière, galette assurée', '081a68ec-8556-44ef-8509-65fea0717b0b', now(), '081a68ec-8556-44ef-8509-65fea0717b0b',now())`]
  )
  .then(result => result.rows[0].name)
}

module.exports = {
getCurrentActivityName:getCurrentActivityName,
guid:guid,
insertUser: insertUser
}
