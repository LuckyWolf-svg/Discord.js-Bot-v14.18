import { REST, Routes, EmbedBuilder, Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
import { userChannels } from '../Events/ChannelCreate.js';

export function registerVoiceButton(client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (message.content === '!VoiceSetting' /*&& message.author === '660368954438582292'*/) {
            const member = message.member;
            if (member.voice.channel) {
                const voiceChannel = member.voice.channel;
                const targetTextChannel = message.guild.channels.cache.find(channel => channel.id === '1347586545388879872');
                if (targetTextChannel) {
                    const buttonname = new ButtonBuilder()
                        .setCustomId('change_channel_name')
                        .setLabel('Изменить название канала')
                        .setStyle(ButtonStyle.Primary);
                    const buttonlimit = new ButtonBuilder()
                        .setCustomId('change_user_limit')
                        .setLabel('Изменить лимит пользователей')
                        .setStyle(ButtonStyle.Primary);
                    const buttonCrown = new ButtonBuilder()
                        .setCustomId('change_crown')
                        .setLabel('Изменить владельца канала')
                        .setStyle(ButtonStyle.Primary);
                    const buttonKick = new ButtonBuilder()
                        .setCustomId('kickVoice')
                        .setLabel('Выгнать с голосового канала')
                        .setStyle(ButtonStyle.Primary);
                    const buttonBan = new ButtonBuilder()
                        .setCustomId('banVoice')
                        .setLabel('Запретить вход')
                        .setStyle(ButtonStyle.Primary);
                    const row = new ActionRowBuilder().addComponents(buttonname,buttonlimit,buttonCrown,buttonKick,buttonBan);
                    await targetTextChannel.send({
                        content: `Вы находитесь в голосовом канале ${voiceChannel.name}. Нажмите на кнопку для изменения его названия.`,
                        components: [row] });
                } else { await message.channel.send("Не удалось найти текстовый канал."); }
            } else { await message.channel.send("Вы не находитесь в голосовом канале id:1346470718233120861");}
        }
    });
    
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;
        const member = interaction.member;
        const userId = interaction.user.id;
        const userChannelId = userChannels[userId];
        const userChannel = interaction.guild.channels.cache.get(userChannelId);
        const voiceChannel = member.voice.channel;
        if (interaction.customId === 'change_channel_name')
        {
            if (userChannel && userChannel.members.has(interaction.user.id)) {
                await interaction.reply(`Введите новое название для канала \`${voiceChannel.name}\``);
                const filter = m => m.author.id === member.id;
                const messageCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });
                messageCollector.on('collect', async m => {
                    try {
                        await voiceChannel.setName(m.content);
                        await interaction.followUp(`Название канала изменено на \`${m.content}\``); }
                    catch (error) {
                        console.error(error);
                        await interaction.followUp('Не удалось изменить название канала.'); }});
                messageCollector.on('end', collected => {
                    if (collected.size === 0) {
                        interaction.followUp('Время для ввода имени канала истекло.'); }});}
                    else {
                        await interaction.followUp("Вы не находитесь в голосовом канале."); }
        }
        else if (interaction.customId === 'change_user_limit')
        {
            await interaction.reply(`Введите новый лимит пользователей для канала \`${voiceChannel.name}\``);
            const filter = m => m.author.id === member.id;
            const messageCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });
            messageCollector.on('collect', async m => {
                const newLimit = parseInt(m.content);
                if (isNaN(newLimit) || newLimit < 0) {
                    await interaction.followUp('Пожалуйста, введите корректное число для лимита пользователей.');
                    return;}
                try {
                    await voiceChannel.setUserLimit(newLimit);
                    await interaction.followUp(`Лимит пользователей для канала изменен на \`${newLimit}\``);
                } catch (error) {
                    console.error(error);
                    await interaction.followUp('Не удалось изменить лимит пользователей канала.');
                }});
            messageCollector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp('Время для ввода лимита пользователей истекло.');
                }});
        }
    });
}