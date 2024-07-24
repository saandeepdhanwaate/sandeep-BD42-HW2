const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./tracks_database.sqlite",
    driver: sqlite3.Database,
  });
})();

// tracks
async function getAllTracks() {
  let query = "SELECT * FROM tracks";
  let response = await db.all(query, []);
  return { tracks: response };
}
app.get("/tracks", async (req, res) => {
  try {
    let result = await getAllTracks();
    if (result.tracks.length === 0) {
      return res.status(404).json({ tracks: "Tracks not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// tracks/artist/:artist
async function getTracksByArtist(artist) {
  let query = "SELECT * FROM tracks WHERE artist = ?";
  let response = await db.all(query, [artist]);
  return { tracks: response };
}
app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await getTracksByArtist(artist);
    if (result.tracks.length === 0) {
      return res.status(404).json({ message: "Tracks not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// tracks/genre/:genre

async function getTracksByGenre(genre) {
  let query = "SELECT * FROM tracks WHERE genre = ?";
  let response = await db.all(query, [genre]);
  return { tracks: response };
}
app.get("/tracks/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await getTracksByGenre(genre);
    if (result.tracks.length === 0) {
      return res.status(400).json({ tracks: "Track genre not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// tracks/release_year/:year
async function getTracksByReleaseYear(release_year) {
  let query = "SELECT * FROM tracks WHERE release_year = ?";
  let response = await db.all(query, [release_year]);
  return { tracks: response };
}
app.get("/tracks/release_year/:year", async (req, res) => {
  try{
    let year = req.params.year;
    let result = await getTracksByReleaseYear(year);
    if(result.tracks.length === 0){
      return res.status(400).json({message : 'Tracks year not found'})
    }
    res.status(200).json(result);
  }catch(error){
    return res.status(500).json({error : error.message})
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
