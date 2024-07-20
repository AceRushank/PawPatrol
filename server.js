//server.js(name of .js file)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// handle form submission pls work ty
app.post('/submit', (req, res) => {
    const { name, email, phone, location, date, details } = req.body;

    //object data for sm idk
    const formData = {
        name,
        email,
        phone,
        location,
        date,
        details
    };

    //merge the data to a new file called form-data.json
    fs.appendFile('form-data.json', JSON.stringify(formData) + '\n', (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Form Data saved to form-data.json');

        //snding response back to client
        res.json('Form submitted successfully!');
    });
});

//starting server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
