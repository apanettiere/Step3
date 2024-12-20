/*
    SETUP
*/
// Express
const express = require("express"); // Express library for the web server
const app = express(); // Instantiate an express object
const bodyParser = require("body-parser"); // For parsing JSON bodies
const db = require("./db-connector"); // Database connector
const PORT = 3075; // Port number

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
      console.error("Error fetching employers:", err.message);
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
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
      console.error("Error adding employer:", err.message);
      res
        .status(500)
        .json({ error: "Error adding employer", details: err.message });
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
      console.error("Error updating employer:", err.message);
      res
        .status(500)
        .json({ error: "Error updating employer", details: err.message });
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
      console.error("Error deleting employer:", err.message);
      res
        .status(500)
        .json({ error: "Error deleting employer", details: err.message });
    } else {
      res.send("Employer deleted successfully");
    }
  });
});

// CRUD Operations for Jobs
app.get("/jobs", (req, res) => {
  const query = `
    SELECT j.job_id, j.job_title, j.employer_id, j.salary, j.insurance, 
           j.job_type, j.qualifications, j.status, e.employer_name 
    FROM Jobs j 
    LEFT JOIN Employers e ON j.employer_id = e.employer_id;
  `;
  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err.message);
      res
        .status(500)
        .json({ error: "Error fetching jobs", details: err.message });
    } else {
      res.json(results);
    }
  });
});

app.get("/jobs/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT j.job_id, j.job_title, j.employer_id, j.salary, j.insurance, 
           j.job_type, j.qualifications, j.status 
    FROM Jobs j 
    WHERE j.job_id = ?;
  `;
  db.pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching job details:", err.message);
      res
        .status(500)
        .json({ error: "Error fetching job details", details: err.message });
    } else if (results.length === 0) {
      res.status(404).send("Job not found");
    } else {
      res.json(results[0]);
    }
  });
});

app.post("/jobs", (req, res) => {
  const {
    job_title,
    employer_id,
    salary,
    insurance,
    job_type,
    qualifications,
    status,
  } = req.body;
  const query = `
    INSERT INTO Jobs (job_title, employer_id, salary, insurance, job_type, qualifications, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  db.pool.query(
    query,
    [
      job_title,
      employer_id,
      salary,
      insurance,
      job_type,
      qualifications,
      status || "available", // Default to 'available' if not provided
    ],
    (err) => {
      if (err) {
        console.error("Error adding job:", err.message);
        res
          .status(500)
          .json({ error: "Error adding job", details: err.message });
      } else {
        res.status(201).send("Job added successfully");
      }
    }
  );
});

app.put("/jobs/:id", (req, res) => {
  const { id } = req.params;
  const {
    job_title,
    employer_id,
    salary,
    insurance,
    job_type,
    qualifications,
    status,
  } = req.body;
  const query = `
    UPDATE Jobs 
    SET job_title = ?, employer_id = ?, salary = ?, insurance = ?, job_type = ?, qualifications = ?, status = ? 
    WHERE job_id = ?;
  `;

  db.pool.query(
    query,
    [
      job_title,
      employer_id,
      salary,
      insurance,
      job_type,
      qualifications,
      status,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating job:", err.message);
        res
          .status(500)
          .json({ error: "Error updating job", details: err.message });
      } else {
        res.send("Job updated successfully");
      }
    }
  );
});

app.delete("/jobs/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Jobs WHERE job_id = ?;`;

  db.pool.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting job:", err.message);
      res
        .status(500)
        .json({ error: "Error deleting job", details: err.message });
    } else {
      res.send("Job deleted successfully");
    }
  });
});

// CRUD Operations for Users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM Users;";
  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      res
        .status(500)
        .json({ error: "Error fetching users", details: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post("/users", (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  const query = `
    INSERT INTO Users (first_name, last_name, email, phone) 
    VALUES (?, ?, ?, ?);
  `;
  db.pool.query(query, [first_name, last_name, email, phone], (err) => {
    if (err) {
      console.error("Error adding user:", err.message);
      res
        .status(500)
        .json({ error: "Error adding user", details: err.message });
    } else {
      res.status(201).send("User added successfully");
    }
  });
});

// CRUD Operations for Users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM Users;";
  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
    } else {
      res.json(results);
    }
  });
});

app.post("/users", (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  const query = `
    INSERT INTO Users (first_name, last_name, email, phone) 
    VALUES (?, ?, ?, ?);
  `;
  db.pool.query(query, [first_name, last_name, email, phone], (err) => {
    if (err) {
      console.error("Error adding user:", err);
      res.status(500).send("Error adding user");
    } else {
      res.status(201).send("User added successfully");
    }
  });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Users WHERE user_id = ?;";
  db.pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Error fetching user");
    } else if (results.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.json(results[0]);
    }
  });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;
  const query = `
    UPDATE Users 
    SET first_name = ?, last_name = ?, email = ?, phone = ? 
    WHERE user_id = ?;
  `;
  db.pool.query(query, [first_name, last_name, email, phone, id], (err) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Error updating user");
    } else {
      res.send("User updated successfully");
    }
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Users WHERE user_id = ?;";
  db.pool.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Error deleting user");
    } else {
      res.send("User deleted successfully");
    }
  });
});

// CRUD Operations for Applications
app.get("/applications", (req, res) => {
  const query = `
    SELECT a.application_id, a.date_submitted, 
           IFNULL(CONCAT(u.first_name, ' ', u.last_name), 'None') AS user_name, 
           IFNULL(j.job_title, 'None') AS job_title, 
           a.interview, a.interview_date, a.application_status 
    FROM Applications a
    LEFT JOIN Users u ON a.user_id = u.user_id
    LEFT JOIN Jobs j ON a.job_id = j.job_id;
  `;
  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching applications:", err.message);
      res
        .status(500)
        .json({ error: "Error fetching applications", details: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post("/applications", (req, res) => {
  const {
    date_submitted,
    user_id,
    job_id,
    interview,
    interview_date,
    application_status,
  } = req.body;

  // Convert "null" strings to actual null
  const normalizedUserId = user_id === "null" || !user_id ? null : user_id;
  const normalizedJobId = job_id === "null" || !job_id ? null : job_id;

  const query = `
    INSERT INTO Applications (date_submitted, user_id, job_id, interview, interview_date, application_status)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  db.pool.query(
    query,
    [
      date_submitted,
      normalizedUserId,
      normalizedJobId,
      interview || 0,
      interview_date || null,
      application_status,
    ],
    (err) => {
      if (err) {
        console.error("Error adding application:", err.message);
        res
          .status(500)
          .json({ error: "Error adding application", details: err.message });
      } else {
        res.status(201).send("Application added successfully");
      }
    }
  );
});

app.get("/applications/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT application_id, date_submitted, user_id, job_id, interview, 
           interview_date, application_status 
    FROM Applications WHERE application_id = ?;
  `;
  db.pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching application:", err.message);
      res
        .status(500)
        .json({ error: "Error fetching application", details: err.message });
    } else if (results.length === 0) {
      res.status(404).send("Application not found");
    } else {
      res.json(results[0]);
    }
  });
});

app.put("/applications/:id", (req, res) => {
  const { id } = req.params;
  const {
    date_submitted,
    user_id,
    job_id,
    interview,
    interview_date,
    application_status,
  } = req.body;

  // Normalize "null" strings to actual null
  const normalizedUserId = user_id === "null" || !user_id ? null : user_id;
  const normalizedJobId = job_id === "null" || !job_id ? null : job_id;

  const query = `
    UPDATE Applications 
    SET date_submitted = ?, user_id = ?, job_id = ?, interview = ?, 
        interview_date = ?, application_status = ? 
    WHERE application_id = ?;
  `;
  db.pool.query(
    query,
    [
      date_submitted,
      normalizedUserId,
      normalizedJobId,
      interview || 0,
      interview_date || null,
      application_status,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating application:", err.message);
        res
          .status(500)
          .json({ error: "Error updating application", details: err.message });
      } else {
        res.send("Application updated successfully");
      }
    }
  );
});

app.delete("/applications/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM Applications WHERE application_id = ?;
  `;
  db.pool.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting application:", err.message);
      res
        .status(500)
        .json({ error: "Error deleting application", details: err.message });
    } else {
      res.send("Application deleted successfully");
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
