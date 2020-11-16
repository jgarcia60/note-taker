
const express = require('express');
const path = require("path");
const fs = require('fs');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.listen(PORT, () => {
    console.log("listening on localhost:" + PORT);
});


const notes = [];

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
    // res.send("This works");

    fs.readFile('db.json', (error, data) =>
        error ? console.error(error) : console.log(data)
    );
    
    res.json({notes});
});


app.post("/api/notes", (req, res) => {
    notes.push(req.body);
    fs.appendFile('db.json', req.body, (err) =>
        err ? console.error(err) : console.log('Added req.body!')
    );
    res.sendFile(path.join(__dirname, "./public/db.json"));
})

app.delete("/api/notes/:id", (req, res) => {
    const newNotes =  deleteID(req.body, notes);
    fs.writeFile('db.json', notes, (err) =>
        err ? console.error(err) : console.log('You have overwritten db.json!')
    );
    res.sendFile(path.join(__dirname, "./public/db.json"));
});

const deleteID = (query, array) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === query) {
            continue;
        } else {
            newArray.push(array[i]);
        }
    }
    return newArray;
}