const express = require("express");
const router = express.Router();
const con = require("../db/dbconnection");
const middleware = require("../middleware/auth");

//Get all products
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// Gets one product
router.get("/:product_id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM products WHERE product_id = ${req.params.product_id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
    // res.send({ product_id: req.params.product_id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
//update products / PUT
router.put(
  "/:product_id",
  middleware,
  (req, res) => {
    // if(req.user.user_type === "Admin") {
    // the below allows you to only need one const, but every input required is inside of the brackets
    const {
      sku,
      name,
      price,
      weight,
      descriptions,
      image,
      category,
      create_date,
      stock,
    } = req.body;
    // OR
    // the below requires you to add everything one by one
    //   const email = req.body.email;
    try {
      con.query(
        //When using the ${}, the content of con.query MUST be in the back tick
        `UPDATE products set sku="${sku}", name="${name}", price="${price}", weight="${weight}", descriptions="${descriptions}", image="${image}", category="${category}", create_date="${create_date}", stock="${stock}" WHERE product_id = "${req.params.product_id}"`,
        (err, result) => {
          if (err) throw err;
          res.send("product successfully updated");
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  // else{
  //   res.send("Not an Admin, access denied!");
  // }
);
// Add new products
router.post(
  "/",
  (req, res) => {
    // if(req.user.user_type === "Admin") {
    // the below allows you to only need one const, but every input required is insproduct_ide of the brackets
    const {
      sku,
      name,
      price,
      weight,
      descriptions,
      image,
      category,
      create_date,
      stock,
    } = req.body;
    // OR
    // the below requires you to add everything one by one
    //   const email = req.body.email;
    try {
      con.query(
        //When using the ${}, the content of con.query MUST be in the back tick
        `INSERT INTO products (
        sku, name, price, weight, descriptions,image, category, create_date, stock) VALUES ( "${sku}", "${name}", "${price}","${weight}", "${descriptions}","${image}", "${category}","${create_date}","${stock}" )`,
        (err, result) => {
          if (err) throw err;
          res.send("product successfully created");
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  // else{
  //     res.send("Not an Admin, access denied!");
  //   }
);
// Delete one products
router.delete(
  "/:product_id",
  middleware,
  (req, res) => {
    // if(req.user.user_type === "Admin") {
    try {
      con.query(
        `DELETE FROM products WHERE product_id = ${req.params.product_id}`,
        (err, result) => {
          if (err) throw err;
          res.send("Sucessfully deleted this product");
        }
      );
      // res.send({ product_id: req.params.product_id });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  // else{
  //   res.send("Not an Admin, access denied!");
  //  }
);
module.exports = router;
