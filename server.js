
const express = require('express');
const path = require("path");
const fs = require('fs');
let db = require('./db/db.json');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.listen(PORT, () => {
    console.log("listening on localhost:" + PORT);
});


// const notes = [];

// fs.writeFile('db.json', notes, (err) =>
//   err ? console.error(err) : console.log('Success!')
// );

app.get("*", function(req, res) {
    // res.send("This works");
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
    // res.send("This works");
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.json(db);
});


// Adding new notes using .post
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      console.log(err);
    };
    // Parsing the data read in db.json
    db = JSON.parse(data);
    // Adding an id to each note based off its index postion. The +1 is necessary, because an id cannot be null
    const newNote = { ...req.body, id: db.length + 1 };
    console.log(newNote);
    // Pushing the new note into the db.json
    db.push(newNote);
    // Writing the note on the page itself
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
      if (err) {
        console.log(err);
      }
      res.json(db);
    });
  });
});


//Deleting notes using .delete, looking at note id's
app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      console.log(err);
    }
    db = JSON.parse(data);
    // It is essentially the same as posting a new note, except we are filtering through the given id added by posting a note
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
