document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("letterForm");
  const modal = document.getElementById("successModal");
  const lettersContainer = document.getElementById("lettersContainer");

  // =========================
  // LOAD LETTERS
  // =========================
  function loadLetters() {
    fetch("http://localhost:3000/letters")
      .then(res => res.json())
      .then(data => {

        console.log("Loaded letters:", data);

        lettersContainer.innerHTML = "";

        if (!Array.isArray(data)) {
          console.error("Invalid data format:", data);
          return;
        }

        data.forEach(letter => {
          const div = document.createElement("div");
          div.classList.add("letter");

          div.innerHTML = `
            <h3>${letter.name}</h3>
            <p>${letter.message}</p>
          `;

          lettersContainer.appendChild(div);
        });

      })
      .catch(err => {
        console.error("Error loading letters:", err);
      });
  }

  // Load on page start
  loadLetters();

  // =========================
  // SEND LETTER
  // =========================
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const message = form.message.value.trim();

    if (!name || !message) {
      alert("Please fill in all fields");
      return;
    }

    fetch("http://localhost:3000/letters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, message })
    })
    .then(res => res.json())
    .then(data => {

      console.log("Saved:", data);

      form.reset();

      if (modal) {
        modal.classList.add("show");
      }

      // refresh letters after saving
      loadLetters();

    })
    .catch(err => {
      console.error("Send error:", err);
      alert("Failed to send letter");
    });
  });

  // =========================
  // CLOSE MODAL
  // =========================
  window.closeSuccess = function () {
    if (modal) {
      modal.classList.remove("show");
    }
  };

});