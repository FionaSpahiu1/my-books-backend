const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Papa = require('papaparse');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Read data from CSV
app.get('/books', (req, res) => {
  fs.readFile('./data/books.csv', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send("Failed to read the CSV file.");
      return;
    }
    Papa.parse(data, {
      header: true,
      complete: results => {
        res.json(results.data);
      }
    });
  });
});

// Add a new book to CSV
app.post('/books', (req, res) => {
  const newBook = req.body;
  const csv = Papa.unparse([newBook], {
    header: false
  });
  console.log(csv)
  fs.appendFile('./data/books.csv', `\n${csv}`, err => {
    if (err) {
      res.status(500).send("Failed to write to the CSV file.");
      return;
    }
    res.status(201).send("Book added.");
  });
});

app.listen(PORT, () => {
  console.log("Server running on port ${5000}");
});