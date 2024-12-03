document.addEventListener("DOMContentLoaded", () => {
  const applicationsTableBody = document.getElementById(
    "applications-table-body"
  );
  const addApplicationForm = document.getElementById("add-application-form");
  const updateApplicationForm = document.getElementById(
    "update-application-form"
  );
  const updateApplicationSection = document.getElementById(
    "update-application-section"
  );

  // Fetch and populate users and jobs dropdowns
  const fetchUsersAndJobs = () => {
    fetch("/users")
      .then((response) => response.json())
      .then((users) => {
        const userDropdowns = document.querySelectorAll(
          "#add-user-id, #update-user-id"
        );
        userDropdowns.forEach((dropdown) => {
          dropdown.innerHTML = users
            .map(
              (user) =>
                `<option value="${user.user_id}">${user.first_name} ${user.last_name}</option>`
            )
            .join("");
        });
      })
      .catch((err) => console.error("Error fetching users:", err));

    fetch("/jobs")
      .then((response) => response.json())
      .then((jobs) => {
        const jobDropdowns = document.querySelectorAll(
          "#add-job-id, #update-job-id"
        );
        jobDropdowns.forEach((dropdown) => {
          dropdown.innerHTML = jobs
            .map(
              (job) => `<option value="${job.job_id}">${job.job_title}</option>`
            )
            .join("");
        });
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  };

  // Fetch and display all applications
  const fetchApplications = () => {
    fetch("/applications")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        return response.json();
      })
      .then((applications) => {
        applicationsTableBody.innerHTML = applications
          .map(
            (application) => `
          <tr>
            <td><button class="edit-btn" data-id="${
              application.application_id
            }">Edit</button></td>
            <td><button class="delete-btn" data-id="${
              application.application_id
            }">Delete</button></td>
            <td>${application.application_id}</td>
            <td>${application.date_submitted}</td>
            <td>${application.user_name}</td>
            <td>${application.job_title}</td>
            <td>${application.interview ? "Yes" : "No"}</td>
            <td>${application.interview_date || "N/A"}</td>
            <td>${application.application_status}</td>
          </tr>
        `
          )
          .join("");
      })
      .catch((err) => console.error("Error fetching applications:", err));
  };

  // Add a new application
  addApplicationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addApplicationForm);
    const applicationData = Object.fromEntries(formData.entries());

    fetch("/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Application added successfully!");
          addApplicationForm.reset();
          fetchApplications();
        } else {
          alert("Failed to add application");
        }
      })
      .catch((err) => console.error("Error adding application:", err));
  });

  // Edit an application
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const applicationId = event.target.dataset.id;

      fetch(`/applications/${applicationId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch application details");
          }
          return response.json();
        })
        .then((application) => {
          updateApplicationForm["application_id"].value =
            application.application_id;
          updateApplicationForm["date_submitted"].value =
            application.date_submitted;
          updateApplicationForm["user_id"].value = application.user_id;
          updateApplicationForm["job_id"].value = application.job_id;
          updateApplicationForm["interview"].value = application.interview
            ? "1"
            : "0";
          updateApplicationForm["interview_date"].value =
            application.interview_date || "";
          updateApplicationForm["application_status"].value =
            application.application_status;

          updateApplicationSection.style.display = "block";
        })
        .catch((err) =>
          console.error("Error fetching application details:", err)
        );
    }
  });

  // Update an application
  updateApplicationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const applicationId = updateApplicationForm["application_id"].value;
    const formData = new FormData(updateApplicationForm);
    const applicationData = Object.fromEntries(formData.entries());

    fetch(`/applications/${applicationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Application updated successfully!");
          fetchApplications();
          updateApplicationSection.style.display = "none";
        } else {
          alert("Failed to update application");
        }
      })
      .catch((err) => console.error("Error updating application:", err));
  });

  // Delete an application
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const applicationId = event.target.dataset.id;

      if (confirm("Are you sure you want to delete this application?")) {
        fetch(`/applications/${applicationId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              alert("Application deleted successfully!");
              fetchApplications();
            } else {
              alert("Failed to delete application");
            }
          })
          .catch((err) => console.error("Error deleting application:", err));
      }
    }
  });

  // Initialize dropdowns and fetch data on page load
  fetchUsersAndJobs();
  fetchApplications();
});
