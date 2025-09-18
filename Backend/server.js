const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');
const app = express();

// Serve static files from 'dist' (frontend build)
app.use(express.static(path.join(__dirname, 'dist')));

const corsOptions = {
  origin: ["http://localhost:3000","https://neuralnetdatascience.com/"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
// MySQL connection
const db = mysql.createConnection({
  host: "193.203.184.125",
  user: "u880709202_jss_scheme",      // change to your username
  password: "NeuralNet@123", // change to your password
  database: "u880709202_jss_scheme" // change to your database
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});
app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});
// POST endpoint to store string
app.post("/store", (req, res) => {
  try {
    // Parse JSON string from req.body.text
    const rawText = req.body.text;
    if (!rawText) {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    let data;
    try {
      data = typeof rawText === "string" ? JSON.parse(rawText) : rawText;
    } catch (parseErr) {
      return res.status(400).json({ error: "Invalid JSON in 'text'" });
    }

    // Insert raw JSON string into snt_beneficiary
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
    const insertRawQuery = "INSERT INTO snt_beneficiary (jslog, server_time) VALUES (?, ?)";

    db.query(insertRawQuery, [JSON.stringify(data), formattedDate], (err, insertResult) => {
      if (err) {
        console.error("Error inserting raw JSON:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }

      // Now handle dynamic_data update
      const keys = Object.keys(data);
      if (!keys.length) {
        // No keys to update in dynamic_data, finish here
        return res.json({ message: "Raw JSON stored successfully, no dynamic data to update", id: insertResult.insertId, server_time: formattedDate });
      }

      // Require 'id' for dynamic_data update
      

      // Get existing columns in dynamic_data
      const getColumnsQuery = `SHOW COLUMNS FROM dynamic_data`;
      db.query(getColumnsQuery, (err, columns) => {
        if (err) {
          console.error("Error fetching columns:", err);
          return res.status(500).json({ error: "Failed to fetch dynamic_data columns" });
        }

        const existingColumns = columns.map(col => col.Field);
        const missingColumns = keys.filter(k => !existingColumns.includes(k));

        // Add missing columns
        const addColumnQueries = missingColumns.map(col => `ALTER TABLE dynamic_data ADD COLUMN \`${col}\` VARCHAR(255)`);

        const runAlterQueries = (queries, index = 0) => {
          if (index >= queries.length) {
            return upsertDynamicData();
          }
          db.query(queries[index], (err) => {
            if (err) {
              console.error("Error adding column:", err);
              return res.status(500).json({ error: "Failed to add column to dynamic_data" });
            }
            runAlterQueries(queries, index + 1);
          });
        };

        if (addColumnQueries.length > 0) {
          runAlterQueries(addColumnQueries);
        } else {
          upsertDynamicData();
        }

        function upsertDynamicData() {
          const keys = Object.keys(data);
          const values = keys.map(k => data[k]);

          // Build placeholders for VALUES part: one '?' per column + one for id
          const placeholdersForValues = keys.map(() => "?").join(", ");

          // Build SET clause for ON DUPLICATE KEY UPDATE, all placeholders
          const setClause = keys.map(k => `\`${k}\` = ?`).join(", ");

          const sql = `
    INSERT INTO dynamic_data ( ${keys.map(k => `\`${k}\``).join(", ")})
    VALUES ( ${placeholdersForValues})
    ON DUPLICATE KEY UPDATE ${setClause}
  `;

          // Values for INSERT: id + keys values
          // Values for UPDATE: keys values again
          const queryValues = [ ...values, ...values];

          db.query(sql, queryValues, (err) => {
            if (err) {
              console.error("Error updating dynamic_data:", err);
              return res.status(500).json({ error: "Failed to update dynamic_data" });
            }
            res.json({
              message: "Raw JSON stored and dynamic_data updated successfully",
              raw_id: insertResult.insertId,
              server_time: formattedDate,
            });
          });
        }

      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/survey", (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 8001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));