const express = require("express");
require("dotenv").config();
const path = require("path");
const authRouter = require("./routes/authRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("mongodb connection established"));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1); // trust first proxy
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",  //name of collection where we will be string our sessions
    }),
    cookie: {
      maxAge: 60000 * 60 * 24,  //it is like a timer for the cookie 1 day
    },
  })
);

app.use("/", authRouter);

app.get("/", function (req, res) {
  res.send("Welcome to the API!");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is:${process.env.PORT}`);
});
