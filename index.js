const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const loadConfigAndTokens = require('./utils/loadConfigAndTokens');
const { createClient } = require('./utils/createClient');

let config;
let tokens;
let clients = {};
const app = express();
({ config, tokens } = loadConfigAndTokens()); // Load configuration before accessing it
const PORT = config.port; // Use port from config.json

// Setup Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
    return res.json({ success: true, message: 'Berhasil bergabung ke channel' });
});

// Start web server
app.listen(PORT, () => {
    console.log(`[WEB] Server berjalan di http://localhost:${PORT}`);
});

async function createClients() {
    for (const { token, voiceChannelId } of tokens) {
        try {
            await createClient(token, voiceChannelId, clients, config);

            await new Promise(resolve => setTimeout(resolve, 10000));
        } catch (error) {
            console.error(`[${token.slice(-5)}] Gagal membuat client untuk token ${token}: ${error}`);
        }
    }
}

createClients();
