import { REST, Routes, EmbedBuilder, Client, Events, GatewayIntentBits, BaseGuildVoiceChannel, ActionRowBuilder, StringSelectMenuBuilder, InteractionType, Embed, NewsChannel } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

export function registerDeletechannel(client) {
client.on(Events.VoiceStateUpdate, async (oldState) => {    
    const channel = oldState.channel;
    if (channel)
    if (channel != 'ChannelToJoinForCreate' && channel.members.size === 0 && channel.parentId == 'YourCategoryForCreatingVoices'){
        try {
            setTimeout(async () => {
                await channel.delete();
                console.log(`Голосовой канал "${channel.name}" был удален.`);
            }, 1000);
        } catch (error) {
            console.error('Ошибка при удалении канала:', error);
        }
}});}
