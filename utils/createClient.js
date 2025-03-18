const { Client } = require('discord.js-selfbot-v13');
const joinVoice = require('./joinVoice');
const sendMessageAndDelete = require('./sendMessageAndDelete');
const handleCommands = require('./handleCommands');

async function createClient(token, voiceChannelId, clients, config) {
    if (clients[token]) {
        console.log(`[${token.slice(-5)}] Klien sudah ada, mengabaikan pembuatan klien.`);
        return;
    }

    const client = new Client();
    clients[token] = client;

    client.once('ready', async () => {
        console.log(`[${token.slice(-5)}] ${client.user.username} berhasil login.`);
        joinVoice(client, voiceChannelId, config);
        sendMessageAndDelete(client, config);
        handleCommands(client, clients, config, token);
    });

    try {
        await client.login(token);
    } catch (error) {
        console.error(`[${token.slice(-5)}] Gagal login dengan token ${token}: ${error}`);
    }
}

module.exports = { createClient, joinVoice };
