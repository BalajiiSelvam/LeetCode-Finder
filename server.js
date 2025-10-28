import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static("public"));

app.get("/leetcode/:username", async (req, res) => {
  const { username } = req.params;

  if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res.status(400).json({ error: "Invalid username" });
  }

  try {
    const apiUrl = `https://leetcode-api-faisalshohag.vercel.app/${username}`;
    console.log("Fetching:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "User not found" });
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    const result = {
      name: data.realName || username,
      ranking: data.ranking || "N/A",
      totalSolved: data.totalSolved || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
      totalEasy: data.totalEasy || 300,
      totalMedium: data.totalMedium || 800,
      totalHard: data.totalHard || 400,
    };

    res.json(result);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});