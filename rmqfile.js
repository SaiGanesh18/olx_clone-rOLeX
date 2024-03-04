const amqp = require('amqplib');
const nodemailer = require('nodemailer');

// RabbitMQ connection URL
const rabbitMQURL = 'amqp://localhost:5672';


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send email using Nodemailer
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
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

// Function to connect to RabbitMQ and send email message
const sendEmailWithRabbitMQ = async (email, username) => {
    try {
        const connection = await amqp.connect(rabbitMQURL);
        const channel = await connection.createChannel();

        const queueName = 'registrationQueue';
        const message = {
            email,
            username,
        };

        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

        console.log('Message sent to RabbitMQ:', message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
    }
};

module.exports = { sendEmail, sendEmailWithRabbitMQ };
