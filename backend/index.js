// index.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database setup
const db_name = path.join(__dirname, "contacts.db"); // DB file in backend folder
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL
        )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          console.log("Contacts table ready ✅");
        }
      }
    );
  }
});

// -------------------------
// API Endpoints
// -------------------------

// POST /contacts → Add new contact
app.post("/contacts", (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)";
    const params = [name, email, phone];
    console.log(params);

    db.run(sql, params, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        email,
        phone,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /contacts → Fetch with pagination
app.get("/contacts", (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Total count for frontend pagination
    db.get("SELECT COUNT(*) AS count FROM contacts", (err, countResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const total = countResult.count;

      // Fetch contacts with limit & offset
      db.all(
        "SELECT * FROM contacts LIMIT ? OFFSET ?",
        [parseInt(limit), parseInt(offset)],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            contacts: rows,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /contacts/:id → Delete by ID
app.delete("/contacts/:id", (req, res) => {
  try {
    const { id } = req.params;

    db.run("DELETE FROM contacts WHERE id = ?", id, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.sendStatus(204); // Success, no content
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// Test route
// -------------------------
app.get("/", (req, res) => {
  res.send("Server with SQLite is running 🚀");
});

// -------------------------
// Start server
// -------------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});