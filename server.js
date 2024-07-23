const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serving static files from the root directory

// Function to read the existing data
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

// Function to write the new data
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

// Function to validate form data
const validateFormData = (formData) => {
    const { name, email, phone, location, date, details } = formData;
    if (!name || !email || !location || !date || !details) {
        return false;
    }
    return true;
};

// Configuration of nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pawpatrolorgntn@gmail.com', // Your email address
        pass: 'ovyb mexi rsrp bjlp' // App-specific password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Function to send email to admin
const sendEmailToAdmin = (formData, callback) => {
    const mailOptions = {
        from: 'pawpatrolorgntn@gmail.com',
        to: 'realgreen2005@gmail.com', // The receiver's email address
        subject: 'New Stray Dog Attack Report Submitted',
        text: `A new stray dog attack report has been submitted with the following details:
        
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Location: ${formData.location}
        Address: ${formData.address || "N/A"}
        Date: ${formData.date}
        Details: ${formData.details}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email', error);
            callback(error);
        } else {
            console.log('Email sent: ' + info.response);
            callback(null);
        }
    });
};

// Function to send confirmation email to user
const sendConfirmationEmail = (formData, callback) => {
    const mailOptions = {
        from: 'pawpatrolorgntn@gmail.com',
        to: formData.email, // The user's email address
        subject: 'Confirmation: Your Stray Dog Attack Report',
        text: `Dear ${formData.name},
        
        Thank you for reporting the stray dog attack. We have received your report with the following details:
        
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Location: ${formData.location}
        Address: ${formData.address || "N/A"}
        Date: ${formData.date}
        Details: ${formData.details}
        
        We appreciate your help in making our community safer.
        
        Best regards,
        Paw Patrol`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending confirmation email', error);
            callback(error);
        } else {
            console.log('Confirmation email sent: ' + info.response);
            callback(null);
        }
    });
};

// To handle form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, location, address, date, details } = req.body;

    const formData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "N/A",
        location: location.trim(),
        address: address ? address.trim() : null,
        date: new Date(date),
        details: details.trim()
    };

    if (!validateFormData(formData)) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    readData((err, existingData) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading existing data.' });
        }

        const updatedData = [...existingData, formData];

        writeData(updatedData, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving form data.' });
            }

            // Send email to admin
            sendEmailToAdmin(formData, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error sending email to admin.' });
                }

                // Send confirmation email to user
                sendConfirmationEmail(formData, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error sending confirmation email to user.' });
                    }

                    res.status(200).json({ message: 'Form data saved successfully and emails sent.' });
                });
            });
        });
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
