const fs = require('fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { clientInfo } = require('./config.json');

const commands = [];
const mainCommandsPath = path.join(__dirname, 'commands');
const mainCommandFiles = fs.readdirSync(mainCommandsPath).filter(file => file.endsWith('.js'));
for (const file of mainCommandFiles) {
    const command = require(path.join(mainCommandsPath, file));
    commands.push(command.data.toJSON());
}
const devCommandPath = path.join(__dirname, 'commands/devCommands');
const devCommandFiles = fs.readdirSync(devCommandPath).filter(file => file.endsWith('.js'));
for (const file of devCommandFiles) {
    const command = require(path.join(devCommandPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(clientInfo.production.token);

rest.put(Routes.applicationCommands(clientInfo.production.applicationId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);