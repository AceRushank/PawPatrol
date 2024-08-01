const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Function to validate form data
const validateFormData = (formData) => {
    const { name, email, phone, location, date, details } = formData;
    if (!name || !email || !location || !date || !details) {
        return false;
    }
    return true;
};

// Function to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, location, address, date, details } = req.body;

    const formData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "N/A",
        location: location.trim(),
        address: address ? address.trim() : null,
        date: new Date(date).toISOString(),
        details: details.trim()
    };

    if (!validateFormData(formData)) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const query = `INSERT INTO form_data (name, email, phone, location, address, date, details)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [formData.name, formData.email, formData.phone, formData.location, formData.address, formData.date, formData.details];

    db.execute(query, params, (err, results) => {
        if (err) {
            console.error('Error saving form data', err);
            return res.status(500).json({ message: 'Error saving form data.' });
        }
        res.status(200).json({ message: 'Form data saved successfully.' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
