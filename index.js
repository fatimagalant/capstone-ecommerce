// Import needed libraries
const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const router = express();
router.set("port", process.env.PORT || 3000);
router.use(express.json());
router.use(cors());

const productRoute = require("./routes/productRoute.js");
const userRoute = require("./routes/userRoute.js");
router.get("/", (req, res) => {
  res.json({
    msg: "Hello",
  });
});

router.use("/index.html", express.static(__dirname + "/index.html"));
router.use("/products", productRoute);
router.use("/users", userRoute);
router.listen(router.get("port"), () => {
  // router.listen(router.get("port"), () => {
  console.log(`Listening for calls on port ${router.get("port")}`);
  console.log("Press Ctrl+C to exit server");
  // });
});
router.use(express.static("public"));
