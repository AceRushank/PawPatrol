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
app.use(express.static(path.join(__dirname))); //serving static files from the root directry
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
        pass: 'ovyb mexi rsrp bjlp' //appspecific password
    },
    tls: {
        rejectUnauthorized: false
    }
});
//fn to send email
const sendEmail = (formData, callback) => {
    const mailOptions = {
        from: 'pawpatrolorgntn@gmail.com',
        to: 'realgreen2005@gmail.com', //the receiver's email address
        subject: 'New Stray Dog Attack Report Submitted',
        text: `A new stray dog attack report has been submitted with the following details:
        
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Location: ${formData.location}
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
//to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, location, date, details } = req.body;

    const formData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "N/A",
        location: location.trim(),
        date: new Date(date).toISOString().split('T')[0],
        details: details.trim()
    };

    if (!validateFormData(formData)) {
        return res.status(400).json({ message: 'Invalid form data' });
    }
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

            //sending email after saving the data
            sendEmail(formData, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error sending email' });
                }
                res.redirect('/thankyou.html'); //redirecting to Thank You page
            });
        });
    });
});
//serving the Thank You page
app.get('/thankyou.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'thankyou.html'));
});
//startinggggg
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
