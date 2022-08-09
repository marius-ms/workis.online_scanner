const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts Looking For Job Offers'),
  new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays Bot Use Guide'),
  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops Looking For Job Offers'),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
