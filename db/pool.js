const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/members_only"
});

// module.exports = new Pool({
//   connectionString: process.env.EXTERNAL_DB_URL,
//   ssl: {
//     require: true,
//     rejectUnauthorized: false
//   }
// });