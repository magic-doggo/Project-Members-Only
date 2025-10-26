const path = require("node:path");
// const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const pool = require("./db/pool");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));
app.get("/sign-up", (req, res) => res.render("sign-up"));
app.get("sign-in", (req, res) => res.render("sign-in"));

app.post("/sign-up",
  body('password').isLength({ min: 5 }),
  body('confirmPassword').custom((value, { req }) => {
    return value === req.body.password;
  }),
  async (req, res, next) => {
    try {
      console.log(req.body.password, req.body.confirmPassword),
      await pool.query("INSERT INTO Users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)", [
        req.body.email,
        req.body.password,
        req.body.firstName,
        req.body.lastName
      ]);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  })

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});