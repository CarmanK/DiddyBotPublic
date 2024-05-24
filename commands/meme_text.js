const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme_text')
        .setDescription('COnVeRt a stRiNG tO MEmE TeXt')
        .setDMPermission(false)
        .addStringOption(option => option.setName('input').setDescription('Enter a string to convert').setRequired(true)),
    async execute(interaction) {
        let str = interaction.options.getString('input');
        str = str.toLowerCase();
        let fin = '';
        let upCount = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i).match(/[a-z]/i)) {
                let random = Math.floor(Math.random() * 2);
                if (random == 1 && upCount < 2) {
                    fin += str.charAt(i).toUpperCase();
                    upCount++;
                }
                else {
                    fin += str.charAt(i);
                    upCount = 0;
                }
            }
            else {
                fin += str.charAt(i);
            }
        }

        // Send the message to the channel and delete the initial interaction
        interaction.channel.send(fin);
        await interaction.editReply(fin);
        await interaction.deleteReply();
    }
};
