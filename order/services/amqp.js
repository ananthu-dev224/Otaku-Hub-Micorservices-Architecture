const ampq = require('amqplib')
const {createOrder} = require('../controller/orderController')

let channel, connection;

const connectRabbitmq = async () => {
    try {
        connection = await ampq.connect('amqp://localhost:5672')
        channel = await connection.createChannel()
        await channel.assertQueue('ORDER')
        await channel.assertQueue('PRODUCT')
        console.log('Connected to RabbitMQ')
    } catch (error) {
        console.error('Failed to connect ampq', error.message)
    }
}

const getChannel = () => channel;

const consumeQueue =  () => {   
    channel.consume('ORDER', async (data) => {
        const orderData = JSON.parse(data.content.toString())
        try {
            const order = await createOrder(orderData);
            channel.sendToQueue('PRODUCT', Buffer.from(JSON.stringify(order)));
            channel.ack(data); // Acknowledge the message
        } catch (error) {
            console.error('Error processing order:', error);
            channel.nack(data); // Reject the message and requeue
        }
    }, { noAck: false });
}

const closeConnection = async () => {
    if (connection) await connection.close();
    if (channel) await channel.close();
}

//if process recieves any termination signal
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);
process.on('exit', closeConnection);



module.exports = {
    connectRabbitmq,
    getChannel,
    consumeQueue,
    closeConnection
}