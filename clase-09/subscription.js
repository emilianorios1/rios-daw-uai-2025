document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("subscription-form");
  var title = document.getElementById("form-title");

  var fields = [
    "fullname", "email", "password", "repeat-password", "age",
    "phone", "address", "city", "postal", "dni"
  ];

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
      var pass = document.getElementById("password").value;
      if (value !== pass) {
        return "Passwords do not match.";
      }
    }

    if (id === "age") {
      var age = parseInt(value);
      if (isNaN(age) || age < 18) {
        return "You must be at least 18 years old.";
      }
    }

    if (id === "phone") {
      if (!/^\d{7,}$/.test(value)) {
        return "Phone number must have at least 7 digits (numbers only).";
      }
    }

    if (id === "address") {
      if (
          value.length < 5 ||
          !/[a-zA-Z]/.test(value) ||   // debe tener letras
          !/\d/.test(value) ||        // debe tener números
          value.indexOf(" ") === -1   // debe tener un espacio
      ) {
        return "Address must include letters, numbers, and a space (min 5 characters).";
      }
    }

    if (id === "city") {
      if (value.length < 3) {
        return "City name must be at least 3 characters.";
      }
    }

    if (id === "postal") {
      if (value.length < 3) {
        return "Postal code must be at least 3 characters.";
      }
    }

    if (id === "dni") {
      if (!/^\d{7,8}$/.test(value)) {
        return "DNI must be 7 or 8 digits.";
      }
    }

    return "";
  }

  // Set up events
  for (var i = 0; i < fields.length; i++) {
    (function (id) {
      var input = document.getElementById(id);

      input.addEventListener("blur", function () {
        var value = input.value.trim();
        var error = validateField(id, value);
        if (error) {
          showError(id, error);
        }
      });

      input.addEventListener("focus", function () {
        clearError(id);
      });

      if (id === "fullname") {
        input.addEventListener("keydown", function () {
          setTimeout(function () {
            var name = input.value.trim();
            if (name.length > 0) {
              title.textContent = "HELLO " + name.toUpperCase();
            } else {
              title.textContent = "HELLO";
            }
          }, 0);
        });

        input.addEventListener("focus", function () {
          var name = input.value.trim();
          title.textContent = name.length > 0 ? "HELLO " + name.toUpperCase() : "HELLO";
        });
      }
    })(fields[i]);
  }

  // On submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var allValid = true;
    var data = {};
    var errorList = [];

    for (var i = 0; i < fields.length; i++) {
      var id = fields[i];
      var value = document.getElementById(id).value.trim();
      var error = validateField(id, value);

      if (error) {
        showError(id, error);
        errorList.push(id + ": " + error);
        allValid = false;
      } else {
        data[id] = value;
      }
    }

    if (!allValid) {
      alert("Please fix the following errors:\n\n" + errorList.join("\n"));
    } else {
      var message = "Form submitted successfully:\n\n";
      for (var key in data) {
        message += key + ": " + data[key] + "\n";
      }
      alert(message);
      form.reset();
      title.textContent = "HELLO";
    }
  });
});