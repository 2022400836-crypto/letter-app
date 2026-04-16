const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend FIRST
app.use(express.static(path.join(__dirname, "public")));

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

// ❌ REMOVE THIS (IMPORTANT)
// app.get("/", (req, res) => {
//   res.send("Server is working ✔");
// });

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

// POST letter
app.post("/letters", (req, res) => {
  const { name, message } = req.body;

  db.query(
    "INSERT INTO letters (name, message) VALUES (?, ?)",
    [name, message],
    (err) => {
      if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ success: true });
    }
  );
});

// IMPORTANT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
