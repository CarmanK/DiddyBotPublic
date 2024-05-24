const fs = require('fs');
const path = require('node:path');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { clientInfo, guilds } = require('./config.json');
const package = require('./package.json');
const util = require('./utils.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution
    ]
});
client.commands = new Map();
const mainCommandsPath = path.join(__dirname, 'commands');
const mainCommandFiles = fs.readdirSync(mainCommandsPath).filter(file => file.endsWith('.js'));
for (const file of mainCommandFiles) {
    const command = require(path.join(mainCommandsPath, file));
    client.commands.set(command.data.name, command);
}
const devCommandPath = path.join(__dirname, 'commands/devCommands');
const devCommandFiles = fs.readdirSync(devCommandPath).filter(file => file.endsWith('.js'));
for (const file of devCommandFiles) {
    const command = require(path.join(devCommandPath, file));
    client.commands.set(command.data.name, command);
}

client.login(clientInfo.production.token);

client.on('error', (error) => {
    let date = new Date();
    console.error(`Error: ${error.message} on ${date}.\n`, error);
});

client.once('ready', async () => {
    client.channels.fetch(guilds.lm.channels.modz).then((channel) => channel.send(`I am back online. Running version: ${package.version}`));

    setInterval(() => {
        client.user.setActivity('Jorkin it', { type: Math.floor(Math.random() * (Object.keys(ActivityType).length / 2)) });
    }, 21600000); // Runs this 4 times per day

    // Initialization
    const initialIndex = Math.floor(Math.random() * (Object.keys(ActivityType).length / 2));
    client.user.setActivity('Jorkin it', { type: initialIndex });

    // Read in the reminders
    try {
        if (fs.existsSync('./reminder_list_file.json')) {
            const reminder_list_file = require('./reminder_list_file.json');
            global.reminders_list = reminder_list_file;
        }
        else {
            global.reminders_list = [];
        }
    }
    catch(error) {
        global.reminders_list = [];
        console.error('Error reading the reminder file.\n', error);
    }

    // Check to see if any of the reminders should be pushed
    setInterval(async () => {
        let time = Date.now();
        if (global.reminders_list !== undefined && global.reminders_list.length !== 0) {
            let shouldUpdateFile = false;
            for (let reminder of global.reminders_list) {
                if (reminder.date <= time) {
                    let user = await client.users.fetch(reminder.user);
                    let guild = await client.guilds.fetch(reminder.guild);
                    let systemChannelId = guild.systemChannelId;
                    if (systemChannelId) {
                        if (systemChannelId === guilds.aaron.channels.general) {
                            systemChannelId = guilds.aaron.channels.botSpam;
                        }
                        client.channels.fetch(systemChannelId).then(channel => channel.send(`${user} ${reminder.message || ''}`));
                    }
                    else {
                        console.log(`Attempted to send the reminder "${reminder.message}" to "${user.username}".`);
                        console.log(`Guild: "${guild.name}" does not have a system channel, so the guild member add event could not be sent.`);
                    }
                    shouldUpdateFile = true;
                }
            }

            // I think this is technically still a race condition but I cbf
            if (shouldUpdateFile) {
                global.reminders_list = global.reminders_list.filter(reminder => reminder.date > time);
                util.writeRemindersToFile();
            }
        }
    }, 1000); // Runs once a second

    console.log(`${new Date()} Logged in.`);
});

client.on('interactionCreate', async interaction => {
    // Must normally reply within 3 seconds, 15 minutes with deferReply
    const startTime = Date.now();
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        return;
    }

    try {
        await interaction.deferReply();
        await command.execute(interaction);
    }
    catch (error) {
        console.error('Error within interactionCreate.\n', error);
        console.error(`Total time of errored interaction ${interaction.commandName} ${Date.now() - startTime}`);
        await interaction.editReply({ content: `There was an error while executing the command: ${interaction.commandName}.`, ephemeral: true });
    }
});

client.on('messageCreate', async (message) => {
    try {
        if (message.content.search(/https?:\/\/(twitter|x)\.com/m) !== -1) {
            message.reply(message.content.replace(/https?:\/\/(twitter|x)\.com/m, 'https://fxtwitter.com'));
        }
    }
    catch(err) {
        console.error(err);
    }
});
