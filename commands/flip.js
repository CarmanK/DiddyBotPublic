const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin')
        .setDMPermission(false),
    async execute(interaction) {
        let random = Math.floor(Math.random() * 2);
        await interaction.editReply(`You flip a coin and it lands on... ${random ? 'head' : 'tail'}s!`);
    }
};
