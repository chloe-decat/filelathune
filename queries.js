const PG = require("pg");
const sha256 = require("sha256");

function insertUser(name, email, password){
  const client = new PG.Client();
  client.connect();
  return client.query(
    "INSERT INTO users (id, name, email, password) VALUES (uuid_generate_v4(), $1::text, $2::text, $3::text) returning id",
    [name, email, password]
  )
  .then(result => {
    client.end();
    return result.rows[0].id;
  })
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

function insertIntoExpenses(name, description, amount, uuid, idActivity, listUser, user){
  const userTab=listUser.substring(1).split(",");
  let userExpense="";
  const client = new PG.Client();
  client.connect();
  return client.query(
    " INSERT INTO expenses(id, name, description,creation_time,modification_time, activity_id,creation_user_id, modification_user_id, amount) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id",
    [uuid,name,description,'now()','now()',idActivity, user, user, amount]
  )
  .then(createUserExpense=>
    {
      userTab.map(email => {
        userExist(email)
        .then(result=>{
          if (result===true){
            return userActivity=insertUser(email, "null", "null");
          } else {
             return userActivity=result;
          }
        })
        .then (insertUsersExpenses=>{
          return client.query(
            "INSERT INTO users_expenses (user_id, expense_id) VALUES ($1, $2) returning user_id, expense_id",
            [insertUsersExpenses, uuid])
        })
        .catch(error => console.log(error));
      })
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
function insertActivity(uuid, startdate, description, titre, user_id) {
  const client = new PG.Client();
  client.connect();
  return client.query(
    "INSERT INTO activities (id, start_date, description, creation_user_id, creation_time, modification_user_id, modification_time, name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning id",
    [uuid, startdate, description,user, 'now()',user, 'now()',titre])
  .then (createUsersActivity=>
  {
    userTab.map(email => {
      userExist(email)
      .then(result=>{
        if (result===true){
          return userActivity=insertUser(email, "null", "null");
        } else {
           return userActivity=result;
        }
      })
      .then (insertUsersActivities=>{
        return client.query(
          "INSERT INTO users_activities (user_id, activity_id) VALUES ($1, $2) returning user_id, activity_id",
          [insertUsersActivities, uuid])
      })
      .catch(error => console.log(error));
    })
  })

function getActivitiesFromUSer(user_id){
  const client = new PG.Client();
  client.connect();
  return client.query(
    "SELECT * FROM activities WHERE id IN (SELECT activity_id FROM users_activities WHERE user_id = $1) ORDER BY start_date DESC",
    [user_id]
  )
  .then(result => {
    client.end();
    return result;
  })
  .catch(error => console.warn(error))
  ;
}

  function userExist(userEmail){
    const client = new PG.Client();
    client.connect();
    return client.query(
      `SELECT * FROM users WHERE email=$1`,
      [`${userEmail}`]
    )
    .then(result => {
      if (result.rows[0]=== undefined) {
          client.end();
         return result=true;
      } else {
        client.end();
        return result.rows[0].id;
      }
    })
  }



module.exports = {
getCurrentActivityName:getCurrentActivityName,
insertUser: insertUser,
insertIntoExpenses:insertIntoExpenses,
insertActivity:insertActivity,
insertIntoUsersActivities:insertIntoUsersActivities,
getActivitiesFromUSer:getActivitiesFromUSer
}
