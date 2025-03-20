import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Loads variables from .env into process.env
const app = express();
const PORT = process.env.PORT || 3000;
const OPENWHYD_USER_ID = process.env.OPENWHYD_USER_ID.toLowerCase(); // Ensure lowercase

// EJS and static files
app.set("view engine", "ejs");
app.use(express.static("public"));

//Middleware to parse JSON requests
app.use(express.json());

// Mood categories and playlist covers
const moodCategories = {
    happy: "0",
    sad: "1",
    chill: "2",
    energetic: "3",
};

const playlistCovers = {
    happy: "https://openwhyd.org/img/playlist/67d4ad57344b36d9fa81a20d_0?localOnly=1",
    sad: "https://openwhyd.org/img/playlist/67d4ad57344b36d9fa81a20d_1?localOnly=1",
    chill: "https://openwhyd.org/img/playlist/67d4ad57344b36d9fa81a20d_2?localOnly=1",
    energetic: "https://openwhyd.org/img/playlist/67d4ad57344b36d9fa81a20d_3?localOnly=1"
};

// Homepage: Select a mood
app.get("/", (req, res) => {
    res.render("index.ejs", { moods: Object.keys(moodCategories), playlistCovers });
});

// Fetch mood-based playlist from OpenWhyd

app.get("/playlist/:mood", async (req, res) => {
    const mood = req.params.mood;
    const playlistId = moodCategories[mood]; // Get the corresponding playlist id

    if (!playlistId) {
        return res.status(404).send("Playlist not found");
    }

    // OpenWhyd API URL 
    const openwhydApiUrl = `https://openwhyd.org/${OPENWHYD_USER_ID}/playlist/${playlistId}?format=json`;


    try {
        const response = await axios.get(openwhydApiUrl);
        let moodTracks = response.data || []; 
        const playlistCover = playlistCovers[mood]; 

        // Log to debug
        console.log(`Fetched ${moodTracks.length} tracks for ${mood}`);

        res.render("playlist", { mood, moodTracks, playlistCover });
           

    } catch (error) {
        console.error(`Error fetching OpenWhyd data for ${mood}:`, error.message);
        res.render("playlist", { mood, moodTracks: [], playlistCover: playlistCovers[mood] }); // Ensure it always has a cover
    }
});

// POST route to handle form submission

app.post("/submit-song-request", (req, res) => {
    const { name, songUrl, message } = req.body;

    if (!name || !songUrl) {
        return res.status(400).json({ success: false, message: "Name and Song URL are required." });
    }

    // Simulating saving the request (In a real app, store it in a database or a file)
    console.log("🎵 New Song Request Submitted:");
    console.log(`- Name: ${name}`);
    console.log(`- Song URL: ${songUrl}`);
    console.log(`- Message: ${message || "No message provided"}`);

    // Send a success response
    res.json({ success: true, message: "Song request submitted successfully!" });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));