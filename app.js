const path = require("node:path");
const bcrypt = require("bcryptjs");
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

app.get("/", (req, res) => res.render("index", { user: req.user }));
app.get("/sign-up", (req, res) => res.render("sign-up", { user: req.user }));
app.get("/sign-in", (req, res) => {res.render("sign-in", { user: req.user })})
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  })
})

passport.use(
  new LocalStrategy({
    usernameField: "email",
  }, async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM Users WHERE email = $1", [username]);
      const user = rows[0];
      console.log(user, "user")
      if (!user) {
        console.log("no user")
        return done(null, false, { message: "Incorrect email" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log("wrong pass")
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    }
    catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log(user.id)
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Users where id = $1", [id]);
    const user = rows[0];
    console.log("deserialize user", user)
    done(null, user);
  } catch (err) {
    done(err);
  }
})

app.post("/sign-up",
  body('password').isLength({ min: 5 }),
  body('confirmPassword').custom((value, { req }) => {
    return value === req.body.password;
  }),
  async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await pool.query("INSERT INTO Users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)", [
        req.body.email,
        hashedPassword,
        req.body.firstName,
        req.body.lastName
      ]);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  });

app.post("/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in"
  })
)


app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});