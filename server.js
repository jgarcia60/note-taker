
const express = require('express');
const path = require("path");
const fs = require('fs');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log("listening on localhost:" + PORT);
});


const notes = [];


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
    res.json({
        notes
    })
});

app.post("/api/notes", (req, res) => {
    notes.push(req.body);
})

app.delete("/api/notes/:id", (req, res) => {
    deleteID(req.body, notes);
})

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