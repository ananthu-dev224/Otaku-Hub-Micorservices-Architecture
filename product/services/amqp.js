const ampq = require('amqplib')

let channel, connection;

const connectRabbitmq = async () => {
    try {
        connection = await ampq.connect('amqp://localhost:5672')
        channel = await connection.createChannel()
        await channel.assertQueue('PRODUCT')
        await channel.assertQueue('ORDER')
        console.log('Connected to RabbitMQ')
    } catch (error) {
        console.error('Failed to connect ampq',error.message)
    }
}

const getChannel = () => channel;

const closeConnection = async () => {
     if(channel) await channel.close();
     if(connection) await connection.close();
}

//if process recieves any termination signal
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);
process.on('exit', closeConnection);

module.exports = {
    connectRabbitmq,
    getChannel,
    closeConnection
}