const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const LocalStorage = require('node-localstorage').LocalStorage;
const session = require("express-session");
const PORT = process.env.PORT || 8000;
const path = require("path");
const ejs = require("ejs");
const localStorage = new LocalStorage('./localStorage');
/**
 * Middleware
 */
app.use(express.json());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "!@*#$(&!#my_secret_()*$!@01293",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.get("/", (req, res) => {
  //res.render("home");
  res.send("api call..")
});

/**
 * Login
 */
app.get("/login", (req, res) => {
  res.send("login");
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const result=req.body
  let user=JSON.parse(localStorage.getItem("user"));
  console.log(user.username);
  if(username == user.username && password == user.password){
    req.session.user=result
  }
  req.session.user = true;
  res.redirect("/dashboard");
});

/**
 * Register
 */
app.get("/register", (req, res) => {
 
});
app.post("/register", (req, res) => {
  const data=req.body;
  localStorage.setItem("user",JSON.stringify(data));
  const a=localStorage.getItem("user");
  console.log(JSON.parse(a));
  res.send(data);
});

/**
 * Dashboard
 */

function isAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else res.redirect("/login");
}

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

/**
 * Logout
 */

app.get("/logout", (req, res) => {
  req.session.user = false;
  res.redirect("/login");
});

app.listen(PORT, (err) => {
  if (err) console.log(`Error listening on ${PORT}`);
  else console.log(`Servers started on port  http://localhost:${PORT}`);
});
