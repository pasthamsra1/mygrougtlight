const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // save images in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB per file

// Set up Express to handle static files (e.g., images)
app.use(express.static('uploads'));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission with image upload
app.post('/submit-quote', upload.array('fileUpload', 6), (req, res) => {
    const { name, email } = req.body;

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'Please upload at least one image.' });
    }

    // Create the transporter for sending the email
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to any email service (e.g., Yahoo, Outlook)
        auth: {
            user: 'groutlight1714@gmail.com', // Replace with your email
            pass: 'minuu@1714'   // Replace with your email password or App Password
        }
    });

    // Email content
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@example.com', // Replace with the recipient's email
        subject: 'Customer Quote Request',
        text: `New quote request from ${name} (${email}).`,
        html: `
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Images:</strong></p>
            <ul>
                ${req.files.map(file => `<li><img src="cid:${file.filename}" width="100" height="100"></li>`).join('')}
            </ul>
        `,
        attachments: req.files.map(file => ({
            filename: file.originalname,
            path: file.path,
            cid: file.filename // Unique CID for embedding in email
        }))
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error sending email.' });
        }
        res.status(200).json({ success: true, message: 'Quote request submitted successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});