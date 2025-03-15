import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Loads variables from .env into process.env
const app = express();
const PORT = process.env.PORT || 3000;
const OPENWHYD_USER_ID = process.env.OPENWHYD_USER_ID;

// EJS and static files
app.set("view engine", "ejs");
app.use(express.static("public"));

// Mood categories and search terms
const moodCategories = {
    happy: "upbeat",
    sad: "melancholy",
    chill: "relaxing",
    energetic: "high-energy",
};

// Homepage: Select a mood
app.get("/", (req, res) => {
    res.render("index.ejs", { moods: Object.keys(moodCategories) });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));