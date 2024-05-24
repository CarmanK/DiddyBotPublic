const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('../utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('odds')
        .setDescription('Roll a number between 1 and a given number')
        .setDMPermission(false)
        .addIntegerOption(option => option
            .setName('integer')
            .setDescription('Enter the upper limit of the range. Must be an integer greater than 0')
            .setMinValue(1)
            .setRequired(true)
        ),
    async execute(interaction) {
        let integerInput = interaction.options.getInteger('integer');
        let random = Math.floor(Math.random() * (integerInput) + 1);
        await interaction.editReply(`A(n) ${util.addCommas(random)} was rolled!`);
    }
};
