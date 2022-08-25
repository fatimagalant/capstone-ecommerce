// Import needed libraries
const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const path = require("path");
require("dotenv").config();

const productRoute = require("./routes/productRoute.js");
const userRoute = require("./routes/userRoute.js");


const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));

// app.use("/index.html", express.static(__dirname + "/index.html"));
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/" + "index.html");
// });

app.use("/products", productRoute);
app.use("/users", userRoute);


app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});
