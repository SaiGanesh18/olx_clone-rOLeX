const amqp = require('amqplib');

const connectRabbitMQ = async () => {
    const connection = await amqp.connect('amqp://saiganeshm:samsung@135@localhost:5672/virtualhost'); // Replace with your RabbitMQ connection URL
    const channel = await connection.createChannel();
    return channel;
};

module.exports = { connectRabbitMQ };
