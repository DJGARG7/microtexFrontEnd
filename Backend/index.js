const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const e = require("express");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rutvaydhami",
  database: "ADMINDASHBOARD",
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.listen(3001, () => {
  console.log("Run on 3001");
});

app.post("/cityMaster/Add", (req, res) => {
  const sql = "INSERT INTO CITYMASTER VALUES(?,?);";
  const cityname = req.body.City;
  const statename = req.body.State;

  db.query(sql, [cityname, statename], (err, result) => {
    console.log(err);
  });
});

app.post("/cityMaster/Delete", (req, res) => {
    const sql = "DELETE FROM CITYMASTER WHERE CityName=?;";
    const cityname = req.body.City;

    db.query(sql,cityname, (err, result) => {
      console.log(result);
    });
  });

app.get("/cityMaster/Add", (req, res) => {
  const sql = "SELECT * FROM CITYMASTER;";
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    else{
        console.log(result);
        res.send(result);
    }
  });
});
