import { Events } from 'discord.js';

export function registerPingCommand(client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    });
}
