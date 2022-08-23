const bcrypt = require("bcryptjs");
const con = require("../../db/dbconnection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Login
async function Login(req, res) {
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
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        // console.log(req.body.password, result[0].password);
        // console.log(isMatch);
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          const payload = {
            user: {
              user_id: result[0].user_id,
              email: result[0].email,
              full_name: result[0].full_name,
              billing_address: result[0].billing_address,
              default_shipping_address: result[0].default_shipping_address,
              country: result[0].country,
              phone: result[0].phone,
              userRole: result[0].userRole,
            },
          };

          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// Register
async function Register(req, res) {
  try {
    let sql = "INSERT INTO users SET ?";
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

    let user = {
      email,
      password: hash,
      full_name,
      billing_address,
      default_shipping_address,
      country,
      cart,
      phone,
      userRole,
    };

    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
}

// Verify
async function Verify(req, res) {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
}

module.exports = {
  Login,
  Register,
  Verify,
};
