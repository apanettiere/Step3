document.addEventListener("DOMContentLoaded", () => {
  const usersTableBody = document.getElementById("users-table-body");
  const addUserForm = document.getElementById("add-user-form");
  const updateUserForm = document.getElementById("update-user-form");
  const updateUserSection = document.getElementById("update-user-section");
  const deleteUserForm = document.getElementById("delete-user-form");

  // Fetch and display all users
  const fetchUsers = () => {
    fetch("/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((users) => {
        usersTableBody.innerHTML = users
          .map(
            (user) => `
          <tr>
            <td><button class="edit-btn" data-id="${user.user_id}">Edit</button></td>
            <td><button class="delete-btn" data-id="${user.user_id}">Delete</button></td>
            <td>${user.user_id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
          </tr>
        `
          )
          .join("");
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  // Add a new user
  addUserForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addUserForm);
    const userData = Object.fromEntries(formData.entries());

    fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          alert("User added successfully!");
          addUserForm.reset();
          fetchUsers();
        } else {
          alert("Failed to add user");
        }
      })
      .catch((err) => console.error("Error adding user:", err));
  });

  // Edit a user
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const userId = event.target.dataset.id;

      fetch(`/users/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
          return response.json();
        })
        .then((user) => {
          updateUserForm["user_id"].value = user.user_id;
          updateUserForm["first_name"].value = user.first_name;
          updateUserForm["last_name"].value = user.last_name;
          updateUserForm["email"].value = user.email;
          updateUserForm["phone"].value = user.phone;

          updateUserSection.style.display = "block";
        })
        .catch((err) => console.error("Error fetching user details:", err));
    }
  });

  // Update a user
  updateUserForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userId = updateUserForm["user_id"].value;
    const formData = new FormData(updateUserForm);
    const userData = Object.fromEntries(formData.entries());

    fetch(`/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          alert("User updated successfully!");
          fetchUsers();
          updateUserSection.style.display = "none";
        } else {
          alert("Failed to update user");
        }
      })
      .catch((err) => console.error("Error updating user:", err));
  });

  // Delete a user
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const userId = event.target.dataset.id;

      if (confirm("Are you sure you want to delete this user?")) {
        fetch(`/users/${userId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              alert("User deleted successfully!");
              fetchUsers();
            } else {
              alert("Failed to delete user");
            }
          })
          .catch((err) => console.error("Error deleting user:", err));
      }
    }
  });

  // Fetch users on page load
  fetchUsers();
});
