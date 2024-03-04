const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail'
    auth: {
        user: 'sgraina3@gmail.com',
        pass: 'rainadon',
    },
});

const rabbitsendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'sgraina3@gmail.com',
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { rabbitsendEmail };
