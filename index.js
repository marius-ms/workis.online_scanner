const { Client, GatewayIntentBits } = require('discord.js');
const { token, userName, password, channelId } = require('./config.json');
const puppeteer = require('puppeteer');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

let channel;
let employerInputData = '';
let cityInputData = '';
let payInputData = '';
let finalCheckData = '';

const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

const { InteractionType } = require('discord.js');

client.once('ready', () => {
  console.log('Ready!');
  channel = client.channels.cache.get(channelId);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.type !== InteractionType.ModalSubmit) return;
  employerInputData = interaction.fields.getTextInputValue('employerInput');
  cityInputData = interaction.fields.getTextInputValue('cityInput');
  payInputData = interaction.fields.getTextInputValue('payInput');
  finalCheckData = interaction.fields.getTextInputValue('finalCheck');
  console.log({ employerInputData, cityInputData, payInputData });
  runScan();
  if (interaction.customId === 'myModal') {
    await interaction.reply(
      '**Scanning For Jobs...**' +
        '\n\n' +
        '**Employer: **' +
        employerInputData +
        '\n' +
        '**City: **' +
        cityInputData +
        '\n' +
        '**Pay: **' +
        payInputData
    );
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'start') {
    const modal = new ModalBuilder()
      .setCustomId('myModal')
      .setTitle('My Modal');

    const employerInput = new TextInputBuilder()
      .setCustomId('employerInput')
      .setLabel('Employer')
      .setStyle(TextInputStyle.Short);

    const cityInput = new TextInputBuilder()
      .setCustomId('cityInput')
      .setLabel('City')
      .setStyle(TextInputStyle.Short);

    const payInput = new TextInputBuilder()
      .setCustomId('payInput')
      .setLabel('Hourly rate')
      .setStyle(TextInputStyle.Short);

    const finalCheck = new TextInputBuilder()
      .setCustomId('finalCheck')
      .setLabel('Look For')
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(employerInput);
    const secondActionRow = new ActionRowBuilder().addComponents(cityInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(payInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(finalCheck);

    modal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow
    );

    await interaction.showModal(modal);
  } else if (commandName === 'info') {
    await interaction.reply(
      '\n**Optimal Way To Start The Bot Correctly: \n\n**- Use command `/start` to open form \n\n- Bot works with **lowercase** and **english** letters only \n\n- Cities input only works with the following inputs: \n\n     vilnius \n     kaunas \n     klaipeda \n     siauliai \n     panevezys \n\n- Cities must be typed in lowercase and only using english letters \n\n**Last input** is used to search through filtered results and find text equal to the input. \n\nFor this it is highly advised to put in the work hours using this format:\n\n`hh:mm - hh:mm` \n\n **Example:**  \n\n`10:00 - 22:00`'
    );
  } else if (commandName === 'stop') {
    stopBot();
    await interaction.reply(
      '**Bot stopped**\n\nBot searched for job offer: ' + scanAmount + ' times'
    );
  }
});

client.login(token);

// ------------------------------------------PUPPETEER--------------------------------------------

let scanAmount = 0;
let adAmount = 0;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function discordMessage() {
  async function sendResultMessage() {
    await delay(10000);
    channel.send('Found a Job Posting Accoding To The Requirements');
  }

  sendResultMessage();
}

let stopState = false;

function stopBot() {
  stopState = true;
}

const runScan = async () => {
  stopState = false;
  //if you're looking for bugs within scanning process use { headless: false} instead of { args: ['--no-sandbox'] }
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://www.workis.online/');
  await page.click('.agree-button');
  await delay(1000);
  await page.click('.county-option');
  await delay(1000);
  await page.mouse.click(360, 440);
  await delay(1000);
  await page.click('.login-btn');
  await delay(2000);
  await page.click('#mat-input-0');
  await page.keyboard.type(userName);
  await page.click('#mat-input-1');
  await page.keyboard.type(password);
  await page.keyboard.press('Enter');
  for (;;) {
    await delay(10000);
    //Opens Filters
    await page.click('#mat-expansion-panel-header-0');
    await delay(1000);
    //Opens City Choice
    await page.click('.mat-select-value');
    await delay(2000);
    const cityOptions = await page.$$('.mat-option-text');
    //Input - Choose City
    if (cityInputData == 'vilnius') {
      await cityOptions[0].click();
    } else if (cityInputData == 'kaunas') {
      await cityOptions[1].click();
    } else if (cityInputData == 'klaipeda') {
      await cityOptions[2].click();
    } else if (cityInputData == 'siauliai') {
      await cityOptions[3].click();
    } else if (cityInputData == 'panevezys') {
      await cityOptions[4].click();
    }
    await delay(1000);
    //Input - Search Term
    await page.mouse.click(90, 228);
    await page.keyboard.type(employerInputData);
    //Input - Salary Range
    await page.mouse.click(430, 289);
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(payInputData);
    await page.keyboard.press('Enter');
    await delay(2000);
    await page.click('#mat-expansion-panel-header-0');
    await delay(2000);
    await page.mouse.move(385, 555);
    await page.mouse.wheel({ deltaY: 1000 });
    await delay(2000);
    const linkHandlers = await page.$$eval('span.ng-star-inserted', (spans) => {
      return spans.map((spans) => spans.textContent);
    });
    console.log(linkHandlers);
    for (let i = 0; i < linkHandlers.length; i++) {
      if (linkHandlers[i].includes(finalCheckData)) {
        adAmount++;
      }
      if (adAmount > 0) {
        discordMessage();
        await delay(10000);
        break;
      }
    }
    scanAmount++;
    console.log('Scanned: ' + scanAmount + ' Times');
    console.log(adAmount + ' Ads');
    adAmount = 0;
    if (stopState == true) {
      scanAmount = 0;
      adAmount = 0;
      await browser.close();
      break;
    }
    await page.reload();
  }
};
