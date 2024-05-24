const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('../utils.js');

let currentYear = new Date().getFullYear();
const monthsWithThirtyOneDaysSet = new Set([1, 3, 5, 7, 8, 10, 12]); // eslint-disable-line no-unused-vars
const monthsWithThirtyDaysSet = new Set([4, 6, 9, 11]);
const monthStrings = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const keyToMillisecondsMapping = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 14 * 24 * 60 * 60 * 1000
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set reminders for upcoming events')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('create_date')
            .setDescription('Set a new reminder for a specific date in the future')
            .addIntegerOption(option => option
                .setName('month')
                .setDescription('Enter a month. Must be an integer from 1 to 12')
                .setMinValue(1)
                .setMaxValue(12)
                .setRequired(true))
            .addIntegerOption(option => option
                .setName('day')
                .setDescription('Enter a day. Must be an integer from 1 to 31')
                .setMinValue(1)
                .setMaxValue(31)
                .setRequired(true))
            .addIntegerOption(option => option
                .setName('year')
                .setDescription(`Enter a year. Must be an integer from ${currentYear} to ${currentYear + 5}`)
                .setMinValue(currentYear)
                .setMaxValue(currentYear + 5)
                .setRequired(true))
            .addStringOption(option => option
                .setName('message')
                .setDescription('Enter a message for this reminder')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('create_time')
            .setDescription('Set a new reminder for a specific amount of time in the future')
            .addIntegerOption(option => option
                .setName('minutes')
                .setDescription('Enter an amount of minutes. Must be an integer greater than 0')
                .setMinValue(1)
                .setRequired(false))
            .addIntegerOption(option => option
                .setName('hours')
                .setDescription('Enter an amount of hours. Must be an integer greater than 0')
                .setMinValue(1)
                .setRequired(false))
            .addIntegerOption(option => option
                .setName('days')
                .setDescription('Enter an amount of days. Must be an integer greater than 0')
                .setMinValue(1)
                .setRequired(false))
            .addIntegerOption(option => option
                .setName('weeks')
                .setDescription('Enter an amount of weeks. Must be an integer greater than 0')
                .setMinValue(1)
                .setRequired(false))
            .addStringOption(option => option
                .setName('message')
                .setDescription('Enter a message for this reminder')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('list')
            .setDescription('List all the reminders')),
    async execute(interaction) {
        let subCommand = interaction.options.getSubcommand();
        if (subCommand === 'create_date') {
            let month = interaction.options.getInteger('month');
            let day = interaction.options.getInteger('day');
            let year = interaction.options.getInteger('year');
            let message = interaction.options.getString('message');

            let feb = 28;
            // Check for a leap year
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                feb = 29;
            }

            if (month === 2 && day > feb) {
                await interaction.editReply({ content: `There are only ${feb} days in February in ${year}. Try again with valid data.`, ephemeral: true });
            }
            else if (monthsWithThirtyDaysSet.has(month) && day === 31) {
                await interaction.editReply({ content: `There are only 30 days in ${monthStrings[month - 1]}. Try again with valid data.`, ephemeral: true });
            }
            else if (Date.now() > (new Date(year, month - 1, day))) {
                await interaction.editReply({ content: 'Your reminder must be set in the future. Try again with valid data.', ephemeral: true });
            }
            else {
                let reminderDate = new Date(year, month - 1, day);
                let fullReminder = {
                    date: reminderDate.getTime(),
                    guild: interaction.guild.id,
                    user: interaction.user.id,
                    message
                };
                global.reminders_list.push(fullReminder);
                util.writeRemindersToFile();
                await interaction.editReply(`Your reminder has been recorded for ${reminderDate}.`);
            }
        }
        else if (subCommand === 'create_time') {
            let minutes = interaction.options.getInteger('minutes');
            let hours = interaction.options.getInteger('hours');
            let days = interaction.options.getInteger('days');
            let weeks = interaction.options.getInteger('weeks');
            let message = interaction.options.getString('message');

            let totalTime = 0;
            if (minutes !== null) {
                totalTime += minutes * keyToMillisecondsMapping['minutes'];
            }
            if (hours !== null) {
                totalTime += hours * keyToMillisecondsMapping['hours'];
            }
            if (days !== null) {
                totalTime += days * keyToMillisecondsMapping['days'];
            }
            if (weeks !== null) {
                totalTime += weeks * keyToMillisecondsMapping['weeks'];
            }

            if (totalTime === 0) {
                await interaction.editReply({ content: 'You must include an amount of time. Try again with valid data.', ephemeral: true });
            }
            else {
                let reminderDate = new Date(Date.now() + totalTime);
                let fullReminder = {
                    date: reminderDate.getTime(),
                    guild: interaction.guild.id,
                    user: interaction.user.id,
                    message
                };
                global.reminders_list.push(fullReminder);
                util.writeRemindersToFile();
                await interaction.editReply(`Your reminder has been recorded for ${reminderDate}.`);
            }
        }
        else {
            let list = global.reminders_list.filter(reminder => reminder.guild === interaction.guild.id);
            if (list.length === 0) {
                await interaction.editReply('There are no reminders.');
            }
            else {
                let reminderListMessage = '```Current reminder(s) for this guild:\n';
                let temp = '';
                list.sort((a, b) => (a.date > b.date) ? 1 : -1);
                for (let reminder of list) {
                    let user = await interaction.client.users.fetch(reminder.user);
                    temp = `${new Date(reminder.date)}: ${user.username} with message "${reminder.message || ''}"\n`;

                    if ((reminderListMessage + temp).length > 1997) {
                        break;
                    }
                    else {
                        reminderListMessage += temp;
                    }
                }

                await interaction.editReply(reminderListMessage + '```');
            }
        }
    }
};
