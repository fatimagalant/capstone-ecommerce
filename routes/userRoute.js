const express = require("express");
const router = express.Router();
const con = require("../db/dbconnection");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");

// GET ALL
router.get("/"),
  (req, res) => {
    try {
      con.query("SELECT * FROM user", (err, result) => {
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
      `SELECT * FROM user where user_id =${req.params.user_id}`,
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


// PUT
router.put("/:user_id", middleware, (req, res) => {
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

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    con.query(
      `UPDATE user SET email="${email}", password="${hash}", full_name="${full_name}", billing_address="${billing_address}", default_shipping_address="${default_shipping_address}", country="${country}", cart="${cart}", phone="${phone}", userRole="${userRole}"  WHERE user_id= "${req.params.user_id}"`,
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
router.delete("/:user_id", (req, res) => {
  try {
    con.query(
      `DELETE from user WHERE user_id="${req.params.user_id}"`,
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

router.get("/", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM user";
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
    let sql = "INSERT INTO user SET ?";
    const {
      full_name,
      email,
      password,
      userRole,
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
      password: hash,
      userRole,
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
    let sql = "SELECT * FROM user WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          // The information the should be stored inside token
          const payload = {
            user: {
              full_name: result[0].full_name,
              email: result[0].email,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
              console.log(req.body);
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
