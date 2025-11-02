#! /usr/bin/env node
const { Client } = require("pg");
require('dotenv').config();
console.log("DB URL Check:", process.env.EXTERNAL_DB_URL);

//membership_status: user/approved_user/admin
const SQL = `
CREATE TABLE IF NOT EXISTS Users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
first_name VARCHAR(255),
last_name VARCHAR(255),
membership_status VARCHAR(255) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS Messages (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
full_message VARCHAR(255) NOT NULL,
timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
author INTEGER,
FOREIGN KEY (author) REFERENCES Users(id) ON DELETE CASCADE
);
`

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.role_name}:${process.env.role_password}@localhost:5432/members_only`,
    // connectionString: process.env.EXTERNAL_DB_URL,
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false
    // }
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();