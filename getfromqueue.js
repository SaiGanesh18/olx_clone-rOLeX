
var amqp = require('amqplib/callback_api');
var nodemailer = require('nodemailer');

function consumeMessagesFromQueue() {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'sendingmail';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log('saiganesh123');
            channel.consume(queue, function (msg) {
                var emailMessage = msg.content.toString();

                const transporter = nodemailer.createTransport({
                    host: 'smtp.office365.com',
                    service: 'outlook',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'saiganeshm48@outlook.com',
                        pass: '@Ganesh11',
                    }
                });

                const mailOptions = {
                    from: 'saiganeshm48@outlook.com',
                    to: emailMessage,
                    text: 'Congrats! you have been registered and you can now start shopping in rOLeX'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error('Email sending failed:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });

                console.log(mailOptions.to);
                console.log(" [x] Received and sent email:", emailMessage);
            }, {
                noAck: true
            });
        });
    });

}

module.exports = { consumeMessagesFromQueue };

