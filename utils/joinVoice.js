const { joinVoiceChannel } = require('@discordjs/voice');

async function joinVoice(client, voiceChannelId, config) {
    try {
        const channel = await client.channels.fetch(voiceChannelId).catch(() => null);
        if (channel && channel.isVoice()) {
            console.log(`[${client.user.username}] Bergabung ke voice channel: ${channel.name} (${channel.id})`);
            const currentConnection = client.voice.connections.find(conn => conn.channel.id === channel.id);
            if (currentConnection) {
                console.log(`[${client.user.username}] Sudah terhubung ke voice channel: ${channel.name} (${channel.id})`);
                return; // Exit the function if already connected
            }
            const connection = joinVoiceChannel({

                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: config.selfDeaf, // Use selfDeaf from config
                selfMute: config.selfMute, // Use selfMute from config
            });

            connection.on('error', error => {
                console.error(`[${client.user.username}] Error voice connection: ${error}`);
                setTimeout(() => joinVoice(client, voiceChannelId, config), 10000);
            });

            connection.on('disconnect', () => {
                console.log(`[${client.user.username}] Voice connection terputus. Mencoba terhubung kembali...`);
                setTimeout(() => joinVoice(client, voiceChannelId, config), 10000);
            });
        } else {
            console.error(`[${client.user.username}] Gagal menemukan voice channel dengan ID: ${voiceChannelId}`);
        }
    } catch (error) {
        console.error(`[${client.user.username}] Gagal bergabung ke voice channel: ${error}`);
        setTimeout(() => joinVoice(client, voiceChannelId, config), 20000);
    }
}

module.exports = joinVoice;
