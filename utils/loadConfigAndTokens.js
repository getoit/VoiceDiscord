const fs = require('fs');

function loadConfigAndTokens() {
    let config, tokens;
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
    return { config, tokens };
}

module.exports = loadConfigAndTokens;