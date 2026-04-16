const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "letter_app"
});

db.connect(err => {
  if (err) {
    console.log("DB error:", err);
  } else {
    console.log("MySQL connected!");
  }
});

// TEST
app.get("/", (req, res) => {
  res.send("Server is working ✔");
});

// GET letters
app.get("/letters", (req, res) => {
  db.query("SELECT * FROM letters ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// POST letter (FIXED)
app.post("/letters", (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  const { name, message } = req.body;

  db.query(
    "INSERT INTO letters (name, message) VALUES (?, ?)",
    [name, message],
    (err, result) => {
      if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ success: true });
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});