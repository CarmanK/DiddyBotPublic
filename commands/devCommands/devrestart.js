const { SlashCommandBuilder } = require('@discordjs/builders');
const { owner } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('devrestart')
        .setDescription('Restart the bot')
        .setDMPermission(false),
    async execute(interaction) {
        if (interaction.user.id === owner) {
            let days = Math.floor(interaction.client.uptime / 1000 / 60 / 60 / 24);
            let hours = Math.floor((interaction.client.uptime / 1000 / 60 / 60) % 24);
            let minutes = Math.floor((interaction.client.uptime / 1000 / 60) % 60);
            await interaction.editReply(`Server restarting and pulling in any new changes after being online for ${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}, and ${minutes} minute${minutes !== 1 ? 's' : ''}.`);
            process.exit();
        }
        else {
            await interaction.editReply('Only admins can use dev commands!');
        }
    }
};
