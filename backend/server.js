import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const PORT = process.env.PORT || 4000;

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });

  try {
    
    const checkUser = await pool.query(
      `SELECT * FROM "User_Score" WHERE username=$1`,
      [username]
    );
    if (checkUser.rows.length > 0)
      return res.status(400).json({ message: "Username already exists" });

    
    const result = await pool.query(
      `INSERT INTO "User_Score" (username, password, reaction_time_score, color_match_score, memory_match_score)
       VALUES ($1, $2, null, 0, 0) RETURNING id, username`,
      [username, password]
    );

    res.json({ message: "Registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM "User_Score" WHERE username=$1 AND password=$2`,
      [username, password]
    );
    const user = result.rows[0];

    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    res.json({ message: "Login successful", username });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/updateReactionScore", async (req, res) => {
  const { username, score } = req.body;

  try {
    const user = await pool.query(
      `SELECT reaction_time_score FROM "User_Score" WHERE username=$1`,
      [username]
    );
    if (user.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const current = user.rows[0].reaction_time_score;
    let msg = "Score not higher than previous.";

    if (current === null || score < current) {
      await pool.query(
        `UPDATE "User_Score" SET reaction_time_score=$1 WHERE username=$2`,
        [score, username]
      );
      msg = "New high score!";
    }

    res.json({ message: msg });
  } catch (err) {
    console.error("Error updating score:", err.message);
    res
      .status(500)
      .json({ message: "Error updating score", error: err.message });
  }
});

/* ---------------------- SERVER START ---------------------- */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
