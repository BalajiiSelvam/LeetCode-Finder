async function searchUser() {
  const username = document.getElementById("username").value.trim();
  const resultDiv = document.getElementById("result");

  if (!username) {
    resultDiv.innerHTML = "<p style='color:red'>Enter a username!</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`/leetcode/${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) {
      resultDiv.innerHTML = `<p style='color:red'>${data.error}</p>`;
      return;
    }

    resultDiv.innerHTML = `
      <h3>${data.name}</h3>
      <p>Ranking: <strong>${data.ranking}</strong></p>
      <p>Total: <strong>${data.totalSolved}</strong></p>
      <p>Easy: <strong>${data.easySolved}</strong> / ${data.totalEasy}</p>
      <p>Medium: <strong>${data.mediumSolved}</strong> / ${data.totalMedium}</p>
      <p>Hard: <strong>${data.hardSolved}</strong> / ${data.totalHard}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = "<p style='color:red'>Server not running</p>";
  }
}