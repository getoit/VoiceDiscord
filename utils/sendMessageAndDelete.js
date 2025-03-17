async function sendMessageAndDelete(client, config) {
    const { messageContent, messageInterval, autoSendMessage, channelId } = config;
    let isPaused = false;

    const sendMessage = async () => {
        if (!isPaused && autoSendMessage) {
            const textChannel = await client.channels.fetch(channelId).catch(() => null);
            if (textChannel && textChannel.isText()) {
                try {
                    const message = await textChannel.send(messageContent);
                    setTimeout(async () => {
                        try {
                            await message.delete();
                        } catch (error) {
                            console.error(`[${client.user.username}] Gagal menghapus pesan: ${error}`);
                        }
                    }, 10);
                } catch (error) {
                    console.error(`[${client.user.username}] Gagal mengirim pesan: ${error}`);
                }
            }
        }
    };

    setInterval(sendMessage, messageInterval);
}

module.exports = sendMessageAndDelete;