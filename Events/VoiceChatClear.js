import { REST, Routes, EmbedBuilder, Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

export function registerVoiceChatClear(client) {
    const messageQueue = new Set(); // Храним сообщения для удаления
    const channelId = '1226780571473149962'; // ID текстового канала, из которого нужно удалять сообщения 
    
    client.on('messageCreate', message => {
        if (message.channel.id === channelId && message.author.id != '927241893245489312') {
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