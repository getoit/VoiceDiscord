const config = require('../config.json'); // Import the config file

function help(client, message) {
    const userId = message.author.id; // Get the ID of the user who sent the message
    const allowedUsers = config.allowedUsers; // Get the allowed users from config

    const tokenUserId = client.user.id; // Get the ID of the bot user

    // Allow only token user and allowed users to execute the command
    if (!allowedUsers.includes(userId) && userId !== tokenUserId) {
        return; // Do nothing if the user is not allowed
    }

    // Prepare the help message
    const helpMessage = `
\`\`\`Help Selfbot 
===================
- Prefix       : ${config.prefix}
- Start cmd    : ${config.startCommand}
- Pause cmd    : ${config.pauseCommand}
- Restart cmd  : ${config.restartCommand}
- Port         : ${config.port}
- ${config.prefix}ping        : Check latency and uptime
===================
\`\`\`
`;


    message.channel.send(helpMessage); // Send the help message
}

module.exports = { help };
