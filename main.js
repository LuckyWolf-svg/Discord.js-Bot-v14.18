import { REST, Routes, EmbedBuilder, Client, ButtonStyle,ButtonBuilder, Events, GatewayIntentBits, BaseGuildVoiceChannel, ActionRowBuilder, StringSelectMenuBuilder, InteractionType, Embed, NewsChannel } from 'discord.js';
import config from './config.json' with { type: "json" };
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });
const CLIENT_ID = 'YourID'



import { registerPingCommand } from './Commands/ping.js';
registerPingCommand(client);
import { registerVoiceButton } from './Commands/VoiceButtons.js';
registerVoiceButton(client);


import { registerDeletechannel } from './Events/ChannelDelete.js';
registerDeletechannel(client);
import { registerChannelButton } from './Events/ChannelCreate.js';
registerChannelButton(client);



client.login(config.token);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});