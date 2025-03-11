import { REST, Routes, EmbedBuilder, Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
import { userChannels } from '../Events/ChannelCreate.js';

export function registerVoiceButton(client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (message.content === '!VoiceSetting' /*&& message.author === '660368954438582292'*/) {
            const member = message.member;
            //you can join to channel for creating channels, run bot and use command
            if (member.voice.channel) {
                const targetTextChannel = message.guild.channels.cache.find(channel => channel.id === 'ChannelToJoinForCreate');
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
                    const buttonUnBan = new ButtonBuilder()
                        .setCustomId('UnbanVoice')
                        .setLabel('Разрешить вход')
                        .setStyle(ButtonStyle.Primary);
                    const row1 = new ActionRowBuilder().addComponents(buttonname, buttonlimit, buttonCrown);
                    const row2 = new ActionRowBuilder().addComponents(buttonKick, buttonBan, buttonUnBan);
                    await targetTextChannel.send({
                        content: `Text`,
                        components: [row1, row2] });
                } else { await message.channel.send("Не удалось найти канал."); }
            } else { await message.channel.send("Вы не находитесь в голосовом канале1");}
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
                await interaction.reply({content: `Введите новое название для канала \`${voiceChannel.name}\``, ephemeral: true});
                const filter = m => m.author.id === member.id;
                const messageCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });
                messageCollector.on('collect', async m => {
                    if (m.content.length > 1 || m.content.length < 100) {
                    try {
                        await voiceChannel.setName(m.content);
                        await interaction.followUp({content: `Название канала изменено на \`${m.content}\``, ephemeral: true}); }
                    catch{}}
                });
                messageCollector.on('end', collected => {
                    try 
                    {
                    if (collected.size === 0) {
                        interaction.followUp({content: 'Время истекло.',ephemeral: true});
                    }
                    } catch {}
                });}
        }
        else if (interaction.customId === 'change_user_limit')
        {
            if (userChannel && userChannel.members.has(interaction.user.id))
            {
            await interaction.reply({content: `Введите новый лимит пользователей для канала \`${voiceChannel.name}\``, ephemeral: true});
            const filter = m => m.author.id === member.id;
            const messageCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });
            messageCollector.on('collect', async m => {
                const newLimit = parseInt(m.content);
                if (isNaN(newLimit) || newLimit < 0 || newLimit > 99) {
                    await interaction.followUp({content: 'Пожалуйста, введите корректное число для лимита пользователей.', ephemeral: true});
                    return;}
                try
                {
                    await voiceChannel.setUserLimit(newLimit);
                    await interaction.followUp({content:`Лимит пользователей для канала изменен на \`${newLimit}\``, ephemeral: true});
                } 
                catch {}
            });
            messageCollector.on('end', collected => {
                try 
                {
                if (collected.size === 0) {
                    interaction.followUp({content: 'Время истекло.', ephemeral: true});
                }} catch {}
                });}
        }
        else if (interaction.customId === 'change_crown')
        { 
            if (userChannel && userChannel.members.has(interaction.user.id))
            {
                await interaction.reply({ content: 'Введите ID пользователя, кому передать права', ephemeral: true });
                const filter = m => m.author.id === interaction.user.id;
                const messagecollector = interaction.channel.createMessageCollector({ filter, time: 15000 });
                messagecollector.on('collect', async m => {
                    try {
                    const targetUserId = m.content;
                    const targetMember = await interaction.guild.members.fetch(targetUserId).catch(() => null);
                    const voiceChannel = targetMember.voice.channel;
                    if (voiceChannel && targetMember.voice.channel == userChannel) {
                        userChannels[userId] = null;
                        userChannels[targetUserId] = userChannelId;
                        await interaction.followUp({ content: `Права были переданы пользователю <@${targetUserId}>.`, ephemeral: true });
                    }}
                    catch {}
                })
                messagecollector.on('end', collected => {
                    try 
                    {
                    if (collected.size === 0) {
                        interaction.followUp({content: 'Время истекло.',ephemeral: true});
                    }
                    } catch {}
                })
            }
        }
        else if (interaction.customId === 'kickVoice')
        {
            if (userChannel && userChannel.members.has(interaction.user.id)) 
            {
                await interaction.reply({ content: 'Введите ID пользователя, кого кикнуть', ephemeral: true });
                const filter = m => m.author.id === interaction.user.id;
                const messagecollector = interaction.channel.createMessageCollector({ filter, time: 15000 });
                messagecollector.on('collect', async m => {
                    try{
                    const targetUserId = m.content;
                    const targetMember = await interaction.guild.members.fetch(targetUserId).catch(() => null);
                    const voiceChannel = targetMember.voice.channel;
                    if (voiceChannel && targetMember.voice.channel == userChannel) {
                        await targetMember.voice.disconnect();
                    }}
                    catch {}
                })
                messagecollector.on('end', collected => {
                    try 
                    {
                    if (collected.size === 0) {
                        interaction.followUp({content: 'Время истекло.',ephemeral: true});
                    }
                    } catch {}
                })
            }
        }
        else if (interaction.customId === 'banVoice')
        {
            if (userChannel && userChannel.members.has(interaction.user.id)) {
                await interaction.reply({ content: 'Введите ID пользователя, которому хотите запретить вход.', ephemeral: true });
                const filter = m => m.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });
                collector.on('collect', async m => {
                try {
                    const userToDeny = m.content;
                    const member = await interaction.guild.members.fetch(userToDeny).catch(() => null);
                    if (member) {
                            await userChannel.permissionOverwrites.edit(member, {
                            Connect: false,
                        });
                        await interaction.followUp({ content: `Вход для пользователя <@${userToDeny}> был запрещен!`, ephemeral: true });

                    }}
                catch {}
                collector.on('end', collected => {
                    try 
                    {
                    if (collected.size === 0) {
                        interaction.followUp({content: 'Время истекло.',ephemeral: true});
                    }
                    } catch {}
                })});}
        }
        else if (interaction.customId === 'UnbanVoice')
        {
            if (userChannel && userChannel.members.has(interaction.user.id)) {
            await interaction.reply({ content: 'Введите ID пользователя, которому хотите разрешить вход.', ephemeral: true });
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });
            collector.on('collect', async m => {
                try {
                const userToDeny = m.content;
                const member = await interaction.guild.members.fetch(userToDeny).catch(() => null);
                if (member) {
                    await userChannel.permissionOverwrites.edit(member, {
                        Connect: true,
                    });
                    await interaction.followUp({ content: `Вход для пользователя <@${userToDeny}> был разрешён!`, ephemeral: true });
                }} 
                catch {}
            collector.on('end', collected => {
                try 
                {
                if (collected.size === 0) {
                    interaction.followUp({content: 'Время истекло.', ephemeral: true});
                }
                } catch {}
            })});}
        }
    });
}
