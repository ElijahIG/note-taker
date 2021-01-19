const express = require("express");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");

function getJson() {
  let data = fs.readFileSync(__dirname + "/db/db.json");
  let json = JSON.parse(data);
  return json;
}

function addNoteToJSON(note) {
  let json = getJson();
  let newNote = {
    title: note.title,
    text: note.text,
    id: nanoid()
  };
  json.push(newNote);
  saveJSON(json);
}

function saveJSON(jsonData) {
  let data = JSON.stringify(jsonData);
  fs.writeFileSync(__dirname + "/db/db.json", data);
}

function deleteNoteFromJSON(id) {
  let json = getJson();
  json = json.filter(function(item) {
    return item.id !== id
})
  saveJSON(json);
}

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
console.log(__dirname);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  let json = getJson();
  res.json(json);
});

app.post("/api/notes", (req, res) => {
  addNoteToJSON(req.body);
  res.json(getJson());
});

app.delete("/api/notes/:id", (req, res) => {
  deleteNoteFromJSON(req.params.id);
  res.json(getJson());
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
