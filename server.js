// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, location, date, details } = req.body;

    // Create a data object
    const formData = {
        name,
        email,
        phone,
        location,
        date,
        details
    };

    // Append the form data to a file
    fs.appendFile('form-data.json', JSON.stringify(formData) + '\n', (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Form Data saved to form-data.json');

        // Send a response back to the client
        res.json('Form submitted successfully!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
