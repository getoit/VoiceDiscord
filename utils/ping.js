let startTime;

function setupUptime() {
    startTime = Date.now();
}

function ping(client, message) {
    const userId = message.author.id; // Get the ID of the user who sent the message
    const config = require('../config.json'); // Import the config file
    const allowedUsers = config.allowedUsers; // Get the allowed users from config

    const tokenUserId = client.user.id; // Get the ID of the bot user

    // Allow only token user and allowed users to execute the command
    if (!allowedUsers.includes(userId) && userId !== tokenUserId) {
        return; // Do nothing if the user is not allowed
    }

    const latency = Date.now() - startTime; // Calculate latency
    startTime = Date.now(); // Update startTime to the current time

    const uptimeInSeconds = Math.floor((Date.now() - startTime) / 1000); // uptime in seconds
    let uptime;

    if (uptimeInSeconds < 60) {
        uptime = `${uptimeInSeconds} s`;
    } else if (uptimeInSeconds < 3600) {
        uptime = `${Math.floor(uptimeInSeconds / 60)} m`;
    } else if (uptimeInSeconds < 86400) {
        uptime = `${Math.floor(uptimeInSeconds / 3600)} h`;
    } else {
        uptime = `${Math.floor(uptimeInSeconds / 86400)} d`;
    }

    const messageContent = `\`\`\`Check Ping & Uptime
===================
- Latency : ${latency}ms
- Uptime  : ${uptime}
===================
\`\`\``;

    message.channel.send(messageContent);
}

module.exports = { ping, setupUptime };
