const joinVoice = require('./joinVoice');
const createClient = require('./createClient');
const { ping, setupUptime } = require('./ping');
const { help } = require('./help'); // Import the help function


let startTime;

function handleCommands(client, clients, config, token) {
    const { prefix, allowedUsers, AutoWakeupJockie, pauseCommand, startCommand, restartCommand } = config;
    let isPaused = false;

    // Setup uptime tracking
    setupUptime();

    client.on('messageCreate', message => {
        const isAllowed = allowedUsers && allowedUsers.includes(message.author.id);
        const isTokenUser = clients[token].user.id === message.author.id;

        const handleCommand = (command, action) => {
            if (isAllowed || isTokenUser) {
                action();
                message.channel.send(`** **`).then(msg => setTimeout(() => { msg.delete().catch(() => {}); }, 10));
            }
        };

        if (message.content === `${prefix}${pauseCommand}`) {
            handleCommand(pauseCommand, () => { isPaused = true; });
        } else if (message.content === `${prefix}${startCommand}`) {
            handleCommand(startCommand, () => { isPaused = false; });
        } else if (message.content === `${prefix}${restartCommand}`) {
            handleCommand(restartCommand, async () => {
                message.channel.send('Restarting...').then(msg => {
                    console.log(`[${token.slice(-5)}] Restarting...`);
                    setTimeout(() => {
                        msg.delete().catch(() => {});
                        setTimeout(() => {
                            client.destroy().then(() => {
                                createClient(token, clients[token].voiceChannelId, clients, config);
                            }).catch(error => {
                                console.error(`[${token.slice(-5)}] Gagal menghancurkan client: ${error}`);
                            });
                        }, 1000);
                    }, 2000);
                });
            });
        } else if (message.content.startsWith(`${prefix}join`)) {
            if (isAllowed || isTokenUser) {
                const args = message.content.split(' ');
                if (args.length === 2) {
                    const tempVoiceChannelId = args[1];
                    const userVoiceChannel = message.member.voice.channel;

                    // Check if the user is already in the specified voice channel
                    if (userVoiceChannel && userVoiceChannel.id === tempVoiceChannelId) {
                        message.channel.send(`Anda sudah berada di voice channel: ${userVoiceChannel.name}`);
                        return; // Exit if the user is already in the channel
                    }

                    joinVoice(client, tempVoiceChannelId, config);
                } else {
                    message.channel.send('Penggunaan: .join <voiceChannelId>');
                }
            }
        } else if (message.mentions.has(client.user) && message.content.includes('wake up') && AutoWakeupJockie) {
            const allowedUserIds = [
                '411916947773587456',
                '412347257233604609',
                '412347553141751808',
                '353639776609632256',
                '412347780841865216'
            ];
            
            if (allowedUserIds.includes(message.author.id)) {
                setTimeout(() => {
                    message.channel.send('yes');
                }, 3000); // 3 seconds
            }
        } else if (message.content.startsWith(`${prefix}say `)) {
            if (isAllowed || isTokenUser) {
                const args = message.content.split(' ').slice(1);
                const sayMessage = args.join(' ');
                message.channel.send(sayMessage);
            }
} else if (message.content.startsWith(`${prefix}ping`)) {
    ping(client, message);
}  else if (message.content.startsWith(`${prefix}help`)) {
    help(client, message); // Call the help function
        }
    });
}

module.exports = handleCommands;
