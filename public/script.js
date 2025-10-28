let chartInstance = null;

async function searchUser() {
  const username = document.getElementById("username").value.trim();
  const resultDiv = document.getElementById("result");

  if (!username) {
    resultDiv.innerHTML = `<p style="color:#e74c3c">Please enter a username!</p>`;
    return;
  }

  resultDiv.innerHTML = `<p>Searching for <strong>${username}</strong>...</p>`;

  try {
    const res = await fetch(`/leetcode/${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) {
    resultDiv.innerHTML = `<p style="color:#e74c3c">${data.error}</p>`;
    return;
    }

    // Destroy old chart
    if (chartInstance) chartInstance.destroy();

    resultDiv.innerHTML = `
      <div class="profile-card">
        <img src="logo.png" alt="Avatar" class="avatar" 
             onerror="this.src=logo.png" />
        <div class="name">${data.name}</div>
        <div class="rank">Rank #${data.ranking.toLocaleString()}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon total">Total</div>
          <div><strong>${data.totalSolved}</strong></div>
        </div>
        <div class="stat-item">
          <div class="stat-icon easy">Easy</div>
          <div><strong>${data.easySolved}</strong> / ${data.totalEasy}</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon medium">Medium</div>
          <div><strong>${data.mediumSolved}</strong> / ${data.totalMedium}</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon hard">Hard</div>
          <div><strong>${data.hardSolved}</strong> / ${data.totalHard}</div>
        </div>
      </div>

      <div class="chart-container">
        <canvas id="pieChart"></canvas>
      </div>
    `;

    // Pie Chart – Centered
    const ctx = document.getElementById("pieChart").getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [{
          data: [data.easySolved, data.mediumSolved, data.hardSolved],
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
          borderWidth: 3,
          borderColor: "#fff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { padding: 20 } },
          tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}` } }
        }
      }
    });

  } catch (err) {
    resultDiv.innerHTML = `<p style="color:#e74c3c">Network error. Is server running?</p>`;
    console.error(err);
  }
}