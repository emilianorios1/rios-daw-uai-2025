document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("subscription-form");
  var title = document.getElementById("form-title");
  var modal = document.getElementById("modal");
  var modalContent = document.getElementById("modal-message");
  var modalClose = document.getElementById("modal-close");

  const fields = ["fullname", "email", "password", "repeat-password", "age", "phone", "address", "city", "postal", "dni"];

  // Cargar datos si existen en localStorage
  const saved = localStorage.getItem("formData");
  if (saved) {
    const parsed = JSON.parse(saved);
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && parsed[id]) el.value = parsed[id];
    });
  }

  function showModal(content) {
    modalContent.innerHTML = content;
    modal.classList.remove("hidden");
  }

  modalClose.onclick = function () {
    modal.classList.add("hidden");
  };

  window.onclick = function (e) {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  };

  function showError(id, message) {
    document.getElementById("error-" + id).textContent = message;
  }

  function clearError(id) {
    document.getElementById("error-" + id).textContent = "";
  }

  function validateField(id, value) {
    if (id === "fullname") {
      if (value.length <= 6 || value.indexOf(" ") === -1) {
        return "Full name must be longer than 6 letters and include a space.";
      }
    }
    if (id === "email") {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        return "Invalid email format.";
      }
    }
    if (id === "password") {
      if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value)) {
        return "Password must have letters and numbers, at least 8 characters.";
      }
    }
    if (id === "repeat-password") {
      if (value !== document.getElementById("password").value) {
        return "Passwords do not match.";
      }
    }
    if (id === "age") {
      const age = parseInt(value);
      if (isNaN(age) || age < 18) return "You must be at least 18 years old.";
    }
    if (id === "phone") {
      if (!/^\d{7,}$/.test(value)) return "Phone number must have at least 7 digits (numbers only).";
    }
    if (id === "address") {
      if (value.length < 5 || !/[a-zA-Z]/.test(value) || !/\d/.test(value) || value.indexOf(" ") === -1) {
        return "Address must include letters, numbers, and a space (min 5 characters).";
      }
    }
    if (id === "city" && value.length < 3) return "City name must be at least 3 characters.";
    if (id === "postal" && value.length < 3) return "Postal code must be at least 3 characters.";
    if (id === "dni" && !/^\d{7,8}$/.test(value)) return "DNI must be 7 or 8 digits.";
    return "";
  }

  for (let id of fields) {
    const input = document.getElementById(id);

    input.addEventListener("blur", () => {
      const value = input.value.trim();
      const error = validateField(id, value);
      if (error) showError(id, error);
    });

    input.addEventListener("focus", () => clearError(id));

    if (id === "fullname") {
      input.addEventListener("keydown", () => {
        setTimeout(() => {
          const name = input.value.trim();
          title.textContent = name.length > 0 ? "HELLO " + name.toUpperCase() : "HELLO";
        }, 0);
      });
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let allValid = true;
    let data = {};
    let errorList = [];

    fields.forEach(id => {
      const value = document.getElementById(id).value.trim();
      const error = validateField(id, value);
      if (error) {
        showError(id, error);
        errorList.push(id + ": " + error);
        allValid = false;
      } else {
        data[id] = value;
      }
    });

    if (!allValid) {
      showModal("<strong>Errores:</strong><br>" + errorList.join("<br>"));
      return;
    }

    const queryParams = new URLSearchParams(data).toString();

    fetch(`https://jsonplaceholder.typicode.com/posts?${queryParams}`, {
      method: "GET"
    })
      .then(response => {
        if (!response.ok) throw new Error("HTTP status " + response.status);
        return response.json();
      })
      .then(() => {
        const message = `Successful Subscription! :)\n\n• ${JSON.stringify(data)}`;
        showModal(message);
        localStorage.setItem("formData", JSON.stringify(data));
        form.reset();
        title.textContent = "HELLO";
      })
      .catch(err => {
        showModal("<strong>Error al enviar datos:</strong><br>" + err.message);
      });
  });
});
