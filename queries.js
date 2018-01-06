const PG = require("pg");
const sha256 = require("sha256");

function getActivity(idActivity){
  const client = new PG.Client();
  client.connect();
  return client.query(
    `SELECT * FROM activities WHERE id=$1`,
    [`${idActivity}`]
  )
  .then(result => {
    client.end();
    return result;
  })
}

function getExpense(idActivity){
  const client = new PG.Client();
  client.connect();
  return client.query(
    `SELECT * FROM expenses WHERE activity_id=$1`,
    [`${idActivity}`]
  )
  .then(result => {
    client.end();
    return result;
  })
}

function getParticipant(idActivity){
  const client = new PG.Client();
  client.connect();
  return client.query(
    `SELECT * FROM users WHERE id IN (SELECT user_id FROM users_activities WHERE activity_id=$1)`,
    [`${idActivity}`]
  )
  .then(result => {
    client.end();
    return result;
  })
}

function getBuyer(idActivity){
  const client = new PG.Client();
  client.connect();
  return client.query(
    `SELECT email FROM users WHERE id IN (SELECT creation_user_id FROM expenses WHERE activity_id=$1);`,
    [`${idActivity}`]
  )
  .then(result => {
    client.end();
    return result;
  })
}

function getExpenseParticipant(idActivity){
  const client = new PG.Client();
  client.connect();
  return client.query(
    `SELECT email FROM users WHERE id IN (SELECT user_id FROM users_expenses WHERE expense_id IN (SELECT id FROM expenses WHERE activity_id=$1));`,
    [`${idActivity}`]
  )
  .then(result => {
    client.end();
    return result;
  })
}

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
function insertUser(name, email, password){
  const client = new PG.Client();
  client.connect();
  return client.query(
    "INSERT INTO users (id, name, email, password) VALUES (uuid_generate_v4(), $1::text, $2::text, $3::text) returning id",
    [name, email, password]
  )
  .then(result => {
    client.end();
    return result.rows[0];
  })
  .catch(error => {
    console.warn(error);
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

function exportActivity(uuid, startdate, description, titre, listUser, user) {
  const userTab=listUser.substring(1).split(",");
  let userActivity="";
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
}

function findOrCreateUser(profile, callback){
  const facebook_id = profile.id;
  const facebook_name = profile.displayName;
  const client = new PG.Client();
  client.connect();
  console.log("profile : " + profile.id);
  return client.query(
    "SELECT * FROM users WHERE facebook_id=$1",
    // "SELECT EXISTS(SELECT facebook_id FROM users WHERE facebook_id=$1)",
    [facebook_id])
  .then(result => {
    if (result.rows[0] !== undefined) {
      callback(null, result.rows[0])
    } else {
      return client.query(
        "INSERT INTO users (id, facebook_id, name) VALUES (uuid_generate_v4(), $1::text, $2::text) returning id, facebook_id,name,password",
        [facebook_id, facebook_name])
      .then(response => {
        client.end();
        callback(null, response);
      })
      .catch(error => {
        callback(error);
      })
    }
  })
  .catch(error => console.log(error))
}

module.exports = {
getExpenseParticipant:getExpenseParticipant,
getBuyer:getBuyer,
getParticipant:getParticipant,
getActivity:getActivity,
getExpense:getExpense,
getActivitiesFromUSer:getActivitiesFromUSer,
userExist:userExist,
insertUser:insertUser,
getCurrentActivityName:getCurrentActivityName,
insertIntoExpenses:insertIntoExpenses,
exportActivity:exportActivity,
findOrCreateUser: findOrCreateUser
}
