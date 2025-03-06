const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

let config;
let tokens;
let clients = {};
const app = express();
loadConfigAndTokens(); // Load configuration before accessing it
const PORT = config.port; // Use port from config.json

// Setup Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadConfigAndTokens() {
    try {
        config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
        tokens = fs.readFileSync('tokens.txt', 'utf8').trim().split('\n').map(line => {
            const [token, voiceChannelId] = line.split(' ');
            return { token, voiceChannelId };
        });
    } catch (error) {
        console.error("Gagal memuat konfigurasi atau token:", error);
        process.exit(1);
    }
}

loadConfigAndTokens();

const { messageContent, prefix, pauseCommand, startCommand, restartCommand, messageInterval, autoSendMessage } = config;

async function createClient(token, voiceChannelId) {
    if (clients[token]) {
        console.log(`[${token.slice(-5)}] Klien sudah ada, mengabaikan pembuatan klien.`);
        return;
    }

    const client = new Client();
    clients[token] = client;
    let intervalId = null;
    let isPaused = false;

    client.once('ready', async () => {
        let displayName = client.user.username;
        try {
            const channel = await client.channels.fetch(voiceChannelId).catch(() => null);
            if (channel && channel.guild) {
                const member = await channel.guild.members.fetch(client.user.id).catch(() => null);
                if (member && member.displayName) {
                    displayName = member.displayName;
                }
            }
        } catch (error) {
            console.error(`[${token.slice(-5)}] Gagal mendapatkan display name: ${error}`);
        }

        console.log(`[${token.slice(-5)}] ${displayName} berhasil login.`);

        const joinVoice = async (tempVoiceChannelId = voiceChannelId) => {
            try {
                const channel = await client.channels.fetch(tempVoiceChannelId).catch(() => null);
                if (channel && channel.isVoice()) {
                    console.log(`[${token.slice(-5)}] ${displayName} bergabung ke voice channel: ${channel.name} (${channel.id})`);
                    const connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                        selfDeaf: config.selfDeaf, // Use selfDeaf from config
                        selfMute: config.selfMute, // Use selfMute from config
                    });

                    connection.on('error', error => {
                        console.error(`[${token.slice(-5)}] Error voice connection: ${error}`);
                        setTimeout(() => joinVoice(tempVoiceChannelId), 10000);
                    });

                    connection.on('disconnect', () => {
                        console.log(`[${token.slice(-5)}] Voice connection terputus. Mencoba terhubung kembali...`);
                        setTimeout(() => joinVoice(tempVoiceChannelId), 10000);
                    });
                } else {
                    console.error(`[${token.slice(-5)}] Gagal menemukan voice channel dengan ID: ${tempVoiceChannelId}`);
                }
            } catch (error) {
                console.error(`[${token.slice(-5)}] Gagal bergabung ke voice channel: ${error}`);
                setTimeout(() => joinVoice(tempVoiceChannelId), 20000);
            }
        };

        joinVoice();

        const sendMessageAndDelete = async () => {
            if (!isPaused && autoSendMessage) {
                const textChannel = await client.channels.fetch(config.channelId).catch(() => null);
                if (textChannel && textChannel.isText()) {
                    try {
                        const message = await textChannel.send(messageContent);
                        setTimeout(async () => {
                            try {
                                await message.delete();
                            } catch (error) {
                                console.error(`[${token.slice(-5)}] Gagal menghapus pesan: ${error}`);
                                setTimeout(() => message.delete().catch(() => {}), 1000);
                            }
                        }, 10);
                    } catch (error) {
                        console.error(`[${token.slice(-5)}] Gagal mengirim pesan: ${error}`);
                    }
                }
            }
        };
        intervalId = setInterval(sendMessageAndDelete, messageInterval);

        client.on('messageCreate', message => {
            const isAllowed = config.allowedUsers && config.allowedUsers.includes(message.author.id);
            const isTokenUser = tokens.some(t => t.token === token && clients[token].user.id === message.author.id);

            if (message.content === `${prefix}${pauseCommand}`) {
                if (isAllowed || isTokenUser) {
                    isPaused = true;
                    message.channel.send('** **').then(msg => setTimeout(() => { msg.delete().catch(() => {}); }, 10));
                }
            } else if (message.content === `${prefix}${startCommand}`) {
                if (isAllowed || isTokenUser) {
                    isPaused = false;
                    message.channel.send('_ _').then(msg => setTimeout(() => { msg.delete().catch(() => {}); }, 10));
                }
            } else if (message.content === `${prefix}${restartCommand}`) {
                if (isAllowed || isTokenUser) {
                    message.channel.send('Restarting...').then(msg => {
                        console.log(`[${token.slice(-5)}] ${displayName} Restarting...`);
                        console.log(`[${token.slice(-5)}] Restarting bot...`);
                        setTimeout(() => {
                            msg.delete().catch(() => {});
                            setTimeout(() => {
                                clearInterval(intervalId);
                                client.destroy().then(() => {
                                    createClient(token, voiceChannelId);
                                }).catch(error => {
                                    console.error(`[${token.slice(-5)}] Gagal menghancurkan client: ${error}`);
                                });
                            }, 1000);
                        }, 2000);
                    });
                }
            } else if (message.content.startsWith(`${prefix}join`)) {
                if (isAllowed || isTokenUser) {
                    const args = message.content.split(' ');
                    if (args.length === 2) {
                        const tempVoiceChannelId = args[1];
                        joinVoice(tempVoiceChannelId);
                    } else {
                        message.channel.send('Penggunaan: .join <voiceChannelId>');
                    }
                }
            } else if (message.mentions.has(client.user) && message.content.includes('wake up') && config.AutoWakeupJockie) {
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
            }

            if (isAllowed && message.author.id !== client.user.id) {
                if (message.content === `${prefix}${pauseCommand}`) {
                    message.channel.send('** **').then(msg => setTimeout(() => { msg.delete().catch(() => {}); }, 10));
                } else if (message.content === `${prefix}${startCommand}`) {
                    message.channel.send('_ _').then(msg => setTimeout(() => { msg.delete().catch(() => {}); }, 10));
                } else if (message.content === `${prefix}${restartCommand}`) {
                    message.channel.send('Restarting...').then(msg => {
                        console.log(`[${token.slice(-5)}] ${displayName} Restarting...`);
                        console.log(`[${token.slice(-5)}] Restarting bot...`);
                        setTimeout(() => {
                            msg.delete().catch(() => {});
                            setTimeout(() => {
                                clearInterval(intervalId);
                                client.destroy().then(() => {
                                    createClient(token, voiceChannelId);
                                }).catch(error => {
                                    console.error(`[${token.slice(-5)}] Gagal menghancurkan client: ${error}`);
                                });
                            }, 1000);
                        }, 2000);
                    });
                } else if (message.content.startsWith(`${prefix}join`)) {
                    const args = message.content.split(' ');
                    if (args.length === 2) {
                        const tempVoiceChannelId = args[1];
                        joinVoice(tempVoiceChannelId);
                    } else {
                        message.channel.send('Penggunaan: .join <voiceChannelId>');
                    }
                }
            }
        });
    });

    try {
        await client.login(token);

        let displayName = client.user.username;
        try {
            const channel = await client.channels.fetch(voiceChannelId).catch(() => null);
            if (channel && channel.guild) {
                const member = await channel.guild.members.fetch(client.user.id).catch(() => null);
                if (member && member.displayName) {
                    displayName = member.displayName;
                }
            }
        } catch (error) {
            console.error(`[${token.slice(-5)}] Gagal mendapatkan display name: ${error}`);
        }
        console.log(`[${token.slice(-5)}] Sabar dulu tot...`);
    } catch (error) {
        console.error(`[${token.slice(-5)}] Gagal login dengan token ${token}: ${error}`);
    }
} // ini penutup function createClient

// Web routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/join-channel', (req, res) => {
    const channelId = req.body.channelId;
    
    if (!channelId) {
        return res.json({ success: false, message: 'Channel ID diperlukan' });
    }
    // Join all clients to the new voice channel
    Object.keys(clients).forEach(token => {
        const client = clients[token];
        if (client && client.isReady()) {
            try {
                const joinVoice = async (tempVoiceChannelId) => {
                    try {
                        const channel = await client.channels.fetch(tempVoiceChannelId).catch(() => null);
                        if (channel && channel.isVoice()) {
                            console.log(`[${token.slice(-5)}] ${client.user.username} bergabung ke voice channel: ${channel.name} (${channel.id})`);
                            const connection = joinVoiceChannel({
                                channelId: channel.id,
                                guildId: channel.guild.id,
                                adapterCreator: channel.guild.voiceAdapterCreator,
                                selfDeaf: config.selfDeaf, // Use selfDeaf from config
                                selfMute: config.selfMute, // Use selfMute from config
                            });
                        }
                    } catch (error) {
                        console.error(`[${token.slice(-5)}] Gagal bergabung ke voice channel: ${error}`);
                    }
                };
                
                joinVoice(channelId);
            } catch (error) {
                console.error(`[${token.slice(-5)}] Gagal bergabung ke voice channel dari web: ${error}`);
            }
        }
    });
    // Mengubah pesan respons
    return res.json({ success: true, message: 'Berhasil bergabung ke channel' });
});

// Start web server
app.listen(PORT, () => {
    console.log(`[WEB] Server berjalan di http://localhost:${PORT}`);
});

async function createClients() {
    for (const { token, voiceChannelId } of tokens) {
        try {
            await createClient(token, voiceChannelId);
            await new Promise(resolve => setTimeout(resolve, 10000));
        } catch (error) {
            console.error(`[${token.slice(-5)}] Gagal membuat client untuk token ${token}: ${error}`);
        }
    }
}

createClients();
