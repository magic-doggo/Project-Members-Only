const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: `postgresql://${process.env.role_name}:${process.env.role_password}@localhost:5432/members_only`,
});

// module.exports = new Pool({
//   connectionString: process.env.EXTERNAL_DB_URL,
//   ssl: {
//     require: true,
//     rejectUnauthorized: false
//   }
// });