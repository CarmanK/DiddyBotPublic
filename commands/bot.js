const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Displays the total uptime of the bot')
        .setDMPermission(false),
    async execute(interaction) {
        let days = Math.floor(interaction.client.uptime / 1000 / 60 / 60 / 24);
        let hours = Math.floor((interaction.client.uptime / 1000 / 60 / 60) % 24);
        let minutes = Math.floor((interaction.client.uptime / 1000 / 60) % 60);
        await interaction.editReply(`I have been online for ${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}, and ${minutes} minute${minutes !== 1 ? 's' : ''}.`);
    }
};
