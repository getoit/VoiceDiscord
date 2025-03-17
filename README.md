# Discord Voice Joiner Selfbot

## Description
A Discord selfbot that joins voice channels and sends/deletes messages automatically.

## Installation
### Prerequisites
- Node.js (version 20.18 or higher)

- npm (Node package manager)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/winclicks/VoiceDiscord
   cd VoiceDiscord
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `config.json` and `tokens.txt`:
   - Update the `config.json` file with your desired settings.
   - Add your Discord tokens and corresponding voice channel IDs in `tokens.txt`, one per line.

## Usage
To start the bot, run:
```bash
npm start
```

### Commands
- **Pause**: Use `.pause` to pause the bot's operations.
- **Start**: Use `.start` to resume the bot's operations.
- **Restart**: Use `.restart` to restart the bot.
- **Join**: Use `.join <channelID>` to join a specified voice channel.
- **Say**: Use `.say <message>` to send a message to the text channel. This command is restricted to allowed users only.


### Joining a Voice Channel
You can join a voice channel via the web interface by sending a POST request to `/join-channel` with the channel ID.

![Screenshot](https://raw.githubusercontent.com/winclicks/VoiceDiscord/refs/heads/main/assets/screenshot.png)

## Configuration
- **port**: Change the port number for the web server.
- **messageContent**: The content of the message to be sent.
- **prefix**: The command prefix for bot commands.
- **pauseCommand**: The command to pause the bot.
- **startCommand**: The command to start the bot.
- **restartCommand**: The command to restart the bot.
- **messageInterval**: The interval (in milliseconds) for sending messages.
- **autoSendMessage**: Set to true to enable automatic message sending.
- **AutoWakeupJockie**: Set to true to enable the auto wake-up feature.
- **channelId**: The ID of the channel where messages will be sent.
- **allowedUsers**: List of user IDs allowed to control the bot.
- **selfDeaf**: Set to true to self-deafen the bot.
- **selfMute**: Set to true to self-mute the bot.

## License
This project is licensed under the MIT License.
