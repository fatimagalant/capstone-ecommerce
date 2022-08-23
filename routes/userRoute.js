const express = require("express");
const router = express.Router();
const con = require("../db/dbconnection");
const middleware = require("../middleware/auth");
const authController = require("../controller/auth/index");

// GET ALL
router.get("/"),
  (req, res) => {
    try {
      con.query("SELECT * FROM products", (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch {
      error(res.status(400), send(error));
      console.log(error);
    }
  };
module.exports = router;

// GET ONE
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users where user_id =${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
    // res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// POST
router.post("/", (req, res) => {
  const {
    email,
    password,
    full_name,
    billing_address,
    default_shipping_address,
    country,
    cart,
    phone,
    userRole,
  } = req.body;
  try {
    con.query(
      `INSERT into users (email,password,full_name,billing_address,default_shipping_address,country,cart,phone,userRole) values ("${email}", "${password}", "${full_name}", "${billing_address}", "${default_shipping_address}", "${country}", "${cart}","${phone}", "${userRole}" )`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// PUT
router.put("/", (req, res) => {
  const {
    email,
    password,
    full_name,
    billing_address,
    default_shipping_address,
    country,
    cart,
    phone,
    userRole,
  } = req.body;
  try {
    con.query(
      `UPDATE users SET email="${email}", password="${password}", full_name="${full_name}", billing_address="${billing_address}",default_shipping_address="${default_shipping_address}",country="${country}", cart="${cart}", phone="${phone}",userRole= "${userRole}" WHERE user.user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// DELETE
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE from users WHERE user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
const bcrypt = require("bcryptjs");
// Register Route
// The Route where Encryption starts
router.post("/register", (req, res) => {
  return authController.Register(req, res);
});

const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Login
router.post("/login", (req, res) => {
  return authController.Login(req, res);
});
// Verify
router.get("/users/verify", (req, res) => {
  return authController.Verify(req, res);
});

router.get("/", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// const bcrypt = require("bcryptjs");

// Register Route
// The Route where Encryption starts
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const {
      full_name,
      email,
      password,
      user_type,
      phone,
      country,
      cart,
      billing_address,
      default_shipping_address,
    } = req.body;

    // The start of hashing / encryption
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      full_name,
      email,
      // We sending the hash value to be stored witin the table
      hash,
      user_type,
      phone,
      country,
      cart,
      billing_address,
      default_shipping_address,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Login
// The Route where Decryption happens
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        // Decryption
        // Accepts the password stored in database and the password given by user (req.body)
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        // If password does not match
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          res.send(result);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
