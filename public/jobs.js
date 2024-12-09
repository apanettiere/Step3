document.addEventListener("DOMContentLoaded", () => {
  const jobsTableBody = document.getElementById("jobs-table-body");
  const addJobForm = document.getElementById("add-job-form");
  const updateJobForm = document.getElementById("update-job-form");
  const updateJobSection = document.getElementById("update-job-section");

  // Fetch and display all jobs
  const fetchJobs = () => {
    fetch("/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return response.json();
      })
      .then((jobs) => {
        jobsTableBody.innerHTML = jobs
          .map(
            (job) => `
          <tr>
            <td><button class="edit-btn" data-id="${
              job.job_id
            }">Edit</button></td>
            <td><button class="delete-btn" data-id="${
              job.job_id
            }">Delete</button></td>
            <td>${job.job_id}</td>
            <td>${job.job_title}</td>
            <td>${job.employer_name || "N/A"}</td>
            <td>${job.salary}</td>
            <td>${job.insurance}</td>
            <td>${job.job_type}</td>
            <td>${job.qualifications}</td>
            <td>${job.status}</td>
          </tr>
        `
          )
          .join("");
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  };

  // Fetch employers for dropdown
  const fetchEmployers = async (dropdownId) => {
    try {
      const response = await fetch("/employers");
      if (!response.ok) {
        throw new Error("Failed to fetch employers");
      }
      const employers = await response.json();
      const dropdown = document.getElementById(dropdownId);
      dropdown.innerHTML =
        `<option value="">Select Employer</option>` +
        employers
          .map(
            (employer) =>
              `<option value="${employer.employer_id}">${employer.employer_name}</option>`
          )
          .join("");
    } catch (err) {
      console.error("Error fetching employers:", err);
    }
  };

  // Fetch jobs and employers on page load
  fetchJobs();
  fetchEmployers("add-employer-id");
  fetchEmployers("update-employer-id");

  // Add a new job
  addJobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addJobForm);
    const jobData = Object.fromEntries(formData.entries());

    fetch("/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Job added successfully!");
          addJobForm.reset();
          fetchJobs();
        } else {
          alert("Failed to add job");
        }
      })
      .catch((err) => console.error("Error adding job:", err));
  });

  // Edit a job
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const jobId = event.target.dataset.id;

      // Fetch job details
      fetch(`/jobs/${jobId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch job details");
          }
          return response.json();
        })
        .then((job) => {
          // Populate form fields
          updateJobForm["job_id"].value = job.job_id;
          updateJobForm["job_title"].value = job.job_title;
          updateJobForm["salary"].value = job.salary;
          updateJobForm["insurance"].value = job.insurance;
          updateJobForm["job_type"].value = job.job_type;
          updateJobForm["qualifications"].value = job.qualifications;
          updateJobForm["status"].value = job.status;

          // Populate and set the employer dropdown
          fetchEmployers("update-employer-id").then(() => {
            updateJobForm["employer_id"].value = job.employer_id || "";
          });

          // Show update section
          updateJobSection.style.display = "block";
        })
        .catch((err) => console.error("Error fetching job details:", err));
    }
  });

  // Update a job
  updateJobForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const jobId = updateJobForm["job_id"].value;
    const formData = new FormData(updateJobForm);
    const jobData = Object.fromEntries(formData.entries());

    fetch(`/jobs/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Job updated successfully!");
          fetchJobs();
          updateJobSection.style.display = "none";
        } else {
          alert("Failed to update job");
        }
      })
      .catch((err) => console.error("Error updating job:", err));
  });

  // Delete a job
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const jobId = event.target.dataset.id;

      if (confirm("Are you sure you want to delete this job?")) {
        fetch(`/jobs/${jobId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              alert("Job deleted successfully!");
              fetchJobs();
            } else {
              alert("Failed to delete job");
            }
          })
          .catch((err) => console.error("Error deleting job:", err));
      }
    }
  });
});
