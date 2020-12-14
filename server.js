// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// Sets up the Express app
const app = express();
// When Heroku runs, process.env.PORT listens and accepts the port number Heroku gives it
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Using the static method allows us to enable the css and javascript file
app.use(express.static('public'));

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Basic route that sends the user to the second page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Reading the dj.json file and returning notes as JSON format
let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

// Displaying all saved notes
app.get("/api/notes", (req, res) => { return res.json(notes) });

// Submiting a note
app.post('/api/notes', (req, res) => {

    // Storing the content posted into newNote variable
    const newNote = req.body;

    // Pushing the new note to the notes variable
    notes.push(newNote);

    // Calling the assign id function
    assignID();

    // Writing the post to db.json file, converting the notes variable to a string
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), (err) => {

        (err) ? console.error(err): res.json(notes);
    })
});

// Creating a function that itterates through the notes.length and creates an id
const assignID = () => {
    for (i = 0; i < notes.length; i++) {
        notes[i].id = i + 1;
        // console.log(notes[i])
    }
};

// Deleting a note
app.delete('/api/notes/:id', function(req, res) {

    // Using the filter method to only include notes that have id's that don't match the deleted id
    notes = notes.filter(x => x.id != req.params.id)

    // Then I rebuild the db.json file
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), (err) => {

        (err) ? console.error(err): res.json(notes);
    });

});


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`))