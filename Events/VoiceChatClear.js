import { REST, Routes, EmbedBuilder, Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

export function registerVoiceChatClear(client) {
    const messageQueue = new Set();
    const channelId = 'ChannelWhereNeedDeleteText';
    
    client.on('messageCreate', message => {
        if (message.channel.id === channelId && message.author.id != 'BotID') {
            messageQueue.add(message);
        }
    });

    setInterval(async () => {
        for (const message of messageQueue) {
            try {
                await message.delete();
            } 
            catch {}
        }
        messageQueue.clear();}, 3000);
}
