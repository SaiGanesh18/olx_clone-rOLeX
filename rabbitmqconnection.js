const amqp = require('amqplib');

const cloudAMQPUrl = process.env.CLOUDAMQP_URL || 'amqp://saiganeshm:samsung@135@localhost:5672/virtualhost'

const connectRabbitMQ = async () => {
    const connection = await amqp.connect(cloudAMQPUrl); // Replace with your RabbitMQ connection URL
    const channel = await connection.createChannel();
    return channel;
};

module.exports = { connectRabbitMQ };
