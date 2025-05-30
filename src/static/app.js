document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";
        activityCard.style.border = '1px solid #e0e0e0';
        activityCard.style.borderRadius = '8px';
        activityCard.style.padding = '1em';
        activityCard.style.marginBottom = '1.2em';
        activityCard.style.background = '#fff';

        const spotsLeft = details.max_participants - details.participants.length;

        // Section participants stylée
        const participantsSection = `
          <div class="participants-section" style="
            margin-top:1em;
            background:#f7f7fa;
            border-radius:8px;
            padding:0.7em 1em;
            box-shadow:0 1px 3px rgba(0,0,0,0.04);
          ">
            <h4 style="margin:0 0 0.3em 0;font-size:1em;color:#3a3a5a;">Participants inscrits :</h4>
            <ul class="participants-list" style="margin:0;padding-left:1.2em;font-size:0.97em;color:#444;">
              ${
                details.participants && details.participants.length > 0
                  ? details.participants.map(p => `<li style="margin-bottom:0.15em;">${p}</li>`).join('')
                  : '<li><em>Aucun participant pour le moment</em></li>'
              }
            </ul>
          </div>
        `;

        activityCard.innerHTML = `
          <h4 style="margin-top:0">${name}</h4>
          <div><strong>Description:</strong> ${details.description}</div>
          <div><strong>Schedule:</strong> ${details.schedule}</div>
          <div><strong>Availability:</strong> ${spotsLeft} spots left</div>
          ${participantsSection}
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
