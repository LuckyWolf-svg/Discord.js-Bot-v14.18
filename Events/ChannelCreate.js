import { REST, Routes, EmbedBuilder, Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
export const userChannels = {};

export function registerChannelButton(client) {
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (newState.channelId === 'ChannelToJoinForCreate') {
        if (newState.channelId && oldState.channelId !== newState.channelId) {
            const guild = newState.guild;
            const newChannel = await guild.channels.create({
                name: `${newState.member.user.username}`,
                parent: 'YourCategoryID',
                type: 2, });
            await newState.member.voice.setChannel(newChannel);
            userChannels[newState.member.user.id] = newChannel.id;
            const textChannel = guild.channels.cache.get(newState.channelId);
        }
    }
});}
