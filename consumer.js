const { sendEmail } = require('./rabbitmqservice');
const { connectRabbitMQ } = require('./rabbitmqconnection');

const consumeEmailQueue = async () => {
    const channel = await connectRabbitMQ();
    const queueName = 'emailQueue';

    channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        if (message) {
            const { email, username } = JSON.parse(message.content.toString());
            sendEmail(email, 'Registration Success', `Hello ${username}, your registration was successful.`);
            channel.ack(message);
        }
    });
};

consumeEmailQueue();
