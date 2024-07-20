const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

//reading new data
const readData = (callback) => {
    fs.readFile('form-data.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file', err);
            callback(err);
        } else {
            callback(null, data ? JSON.parse(data) : []);
        }
    });
};

//writing new data
const writeData = (data, callback) => {
    fs.writeFile('form-data.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file', err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

//validations
const validateFormData = (formData) => {
    const { name, email, phone, location, date, details } = formData;
    if (!name || !email || !location || !date || !details) {
        return false;
    }
    //if adding more validations or loops
    return true;
};

//handle form submissions IMPP
app.post('/submit', (req, res) => {
    const { name, email, phone, location, date, details } = req.body;

    //structure formdata
    const formData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "N/A",
        location: location.trim(),
        date: new Date(date).toISOString().split('T')[0], // Ensure date is in YYYY-MM-DD format
        details: details.trim()
    };

    // to validate the form data
    if (!validateFormData(formData)) {
        return res.status(400).json({ message: 'Invalid form data' });
    }

    //read the existing data, append the new data, and then write the data or in simple terms error handling
    readData((err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        data.push(formData);

        writeData(data, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.log('Form Data saved to form-data.json');
            res.redirect('/thankyou.html'); // Redirect to Thank You page
        });
    });
});

//thank you page
app.get('/thankyou.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'thankyou.html'));
});
//starttttttt
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
