/*
    SETUP
*/
// Express
const express = require("express"); // Express library for the web server
const app = express(); // Instantiate an express object
const bodyParser = require("body-parser"); // For parsing JSON bodies
const db = require("./db-connector"); // Database connector
const PORT = 3068; // Port number

// Middleware
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve static files from the "public" directory
app.use(express.static("public"));

/*
    ROUTES
*/

// Redirect root URL to the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// CRUD Operations for Employers
app.get("/employers", (req, res) => {
  const query = "SELECT * FROM Employers;";
  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employers:", err);
      res.status(500).send("Error fetching employers");
    } else {
      res.json(results);
    }
  });
});

app.post("/employers", (req, res) => {
  const { employer_name, email, phone } = req.body;
  const query = `INSERT INTO Employers (employer_name, email, phone) VALUES (?, ?, ?);`;

  db.pool.query(query, [employer_name, email, phone], (err) => {
    if (err) {
      console.error("Error adding employer:", err);
      res.status(500).send("Error adding employer");
    } else {
      res.status(201).send("Employer added successfully");
    }
  });
});

app.put("/employers/:id", (req, res) => {
  const { id } = req.params;
  const { employer_name, email, phone } = req.body;
  const query = `
    UPDATE Employers 
    SET employer_name = ?, email = ?, phone = ? 
    WHERE employer_id = ?;
  `;

  db.pool.query(query, [employer_name, email, phone, id], (err) => {
    if (err) {
      console.error("Error updating employer:", err);
      res.status(500).send("Error updating employer");
    } else {
      res.send("Employer updated successfully");
    }
  });
});

app.delete("/employers/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Employers WHERE employer_id = ?;`;

  db.pool.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting employer:", err);
      res.status(500).send("Error deleting employer");
    } else {
      res.send("Employer deleted successfully");
    }
  });
});

/*
    LISTENER
*/
app.listen(PORT, () => {
  console.log(
    `Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`
  );
});
