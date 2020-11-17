
const express = require('express');
const path = require("path");
const fs = require('fs');
let db = require("./db/db.json");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
//need this line below to link static .js files in the HTML
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.listen(PORT, () => {
    console.log("listening on localhost:" + PORT);
});


app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  console.log(db + "at getAndRenderNotes()");
  res.json(db);
});



app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      console.log(err);
    };
    // Parsing the data in db.json
    db = JSON.parse(data);
    // Adding an id to each note based off its index postion.
    const newNote = { ...req.body, id: db.length + 1 };
    console.log(newNote);
    db.push(newNote);
    // Writing the note to the file
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
      if (err) {
        console.log(err);
      }
      
    });
  });
  
  res.json(db);
});

//Delete note
app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      console.log(err);
    }
    db = JSON.parse(data);
    //write new note
    const newDB = db.filter((note) => note.id != parseInt(req.params.id));
    console.log(newDB);
    fs.writeFile("./db/db.json", JSON.stringify(newDB), (err) => {
      if (err) {
        console.log(err);
      }
      res.json(newDB);
    });
    
  });
  
});

//needed to move this get call to the end so that the other paths could be accessed first
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});