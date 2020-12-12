// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// Sets up the Express app
const app = express();
const PORT = 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Using the static method allows us to enable the css and javascript file
app.use(express.static('public'));

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Basic route that sends the user to the second page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Reading the notes in db.json file
app.get('/api/notes', (req, res) => fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    // If there is no error it will send back the body as json and then parses the data
    (err) ? console.error(err): res.json(JSON.parse(data));
}));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`))