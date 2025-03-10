const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/contact", (req, res) => {
  res.json({ message: "Email sent successfully" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
