// const express = require("express");
const express = require("express");
const router = express.Router();
const con = require("../db/dbconnection.js");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch {
    error(res.status(400), send(error));
    console.log(error);
  }
});
module.exports = router;
