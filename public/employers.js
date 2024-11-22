document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("employers-table-body");
  const addForm = document.getElementById("add-employer-form");
  const updateForm = document.getElementById("update-employer-form");
  const updateSection = document.getElementById("update-employer-section");

  // Fetch and display employers
  const fetchEmployers = () => {
    fetch("/employers")
      .then((response) => response.json())
      .then((data) => {
        tableBody.innerHTML = data
          .map(
            (emp) => `
            <tr>
              <td>${emp.employer_id}</td>
              <td>${emp.employer_name}</td>
              <td>${emp.email}</td>
              <td>${emp.phone}</td>
              <td>
                <button class="edit-btn" data-id="${emp.employer_id}" data-name="${emp.employer_name}" data-email="${emp.email}" data-phone="${emp.phone}">Edit</button>
                <button class="delete-btn" data-id="${emp.employer_id}">Delete</button>
              </td>
            </tr>`
          )
          .join("");
      })
      .catch((err) => console.error("Error fetching employers:", err));
  };

  // Call fetchEmployers on page load
  fetchEmployers();

  // Add a new employer
  addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(addForm);
    const data = Object.fromEntries(formData.entries());

    fetch("/employers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert("Employer added successfully!");
          fetchEmployers();
          addForm.reset();
        } else {
          alert("Failed to add employer");
        }
      })
      .catch((err) => console.error("Error adding employer:", err));
  });

  // Delete an employer
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const id = event.target.dataset.id;

      if (confirm("Are you sure you want to delete this employer?")) {
        fetch(`/employers/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              alert("Employer deleted successfully!");
              fetchEmployers();
            } else {
              alert("Failed to delete employer");
            }
          })
          .catch((err) => console.error("Error deleting employer:", err));
      }
    }
  });

  // Edit an employer
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const id = event.target.dataset.id;
      const name = event.target.dataset.name;
      const email = event.target.dataset.email;
      const phone = event.target.dataset.phone;

      // Populate the update form with existing data
      updateForm["employer_id"].value = id;
      updateForm["employer_name"].value = name;
      updateForm["email"].value = email;
      updateForm["phone"].value = phone;

      // Show the update section
      updateSection.style.display = "block";
    }
  });

  // Update an employer
  updateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = updateForm["employer_id"].value;
    const formData = new FormData(updateForm);
    const data = Object.fromEntries(formData.entries());

    fetch(`/employers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert("Employer updated successfully!");
          fetchEmployers();
          updateForm.reset();
          updateSection.style.display = "none"; // Hide the update section
        } else {
          alert("Failed to update employer");
        }
      })
      .catch((err) => console.error("Error updating employer:", err));
  });
});
