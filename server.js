const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); //serving static files from the root directory aka from the menu

//fn to read the existing data
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

//fn to write the new data
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

//fn to validate form data
const validateFormData = (formData) => {
    const { name, email, phone, location, date, details } = formData;
    if (!name || !email || !location || !date || !details) {
        return false;
    }
    return true;
};

//config of nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pawpatrolorgntn@gmail.com', //your email address
        pass: 'ovyb mexi rsrp bjlp' //app-specific password
    },
    tls: {
        rejectUnauthorized: false
    }
});

//fn to send email to admin
const sendEmailToAdmin = (formData, callback) => {
    const mailOptions = {
        from: 'pawpatrolorgntn@gmail.com',
        to: 'realgreen2005@gmail.com', //the receiver's email address
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

//fn to send confirmation email to user
const sendConfirmationEmail = (formData, callback) => {
    const mailOptions = {
        from: 'pawpatrolorgntn@gmail.com',
        to: formData.email, //the user's email address
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

//to handle form submission
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

            //send email to admin
            sendEmailToAdmin(formData, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error sending email to admin.' });
                }

                //send confirmation email to user (DOESNT WORK)
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
//startt plssss
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
