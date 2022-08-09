
# Workis.online Ads Scanner

A bot that scans for job offers on 'workis.online'
using input filters on discord and notifies the user once the bot finds a job offer that meets
set requirements.

Since 'workis.online' has it's own notifications which are delayed, the bot
is best used for job offers that are added every week and are highly sought after between users (usually job is given to the first user
that applies).


## Authors

- [@Marius](https://www.github.com/https://github.com/marius-ms)


## Contributing

Contributions are always welcome!




## Deployment

To deploy this project run

```bash
  node index.js
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/marius-ms/workis_online-ads-scanner
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install discord.js
```
```bash
  npm i puppeteer
```
```bash
  npm install @discordjs/rest
```

Start the Bot

```bash
  node index.js
```


## Environment Variables

To run this project, you will need to edit the following environment variables on your config.json file.

  "channelId": "channel Id",

  "clientId": "client Id",

  "guildId": "server Id",

  "token": "Bot token",

  "userName": "workis.online username",

  "password": "workis.online password"


## Usage/Examples

### Commands:
#### Display bot guide
```bash
  /info
```
#### Run Bot
```bash
  /start
```

Displays discord form, once it's submitted starts scanning for job offers.

  ![Form's screenshot](/assets/images/formInput.png?raw=true "Optional Title")

#### Employer Input 
Accepts any string. Bot was built in mind that this input would be used for employers name. Using job adress, work hours or pay might also work.

#### City Input
Accepts these strings: 

- vilnius

- kaunas

- klaipeda

- siauliai

- panevezys

Must be written in english and lowercase letters.

#### Hourly Rate Input

Accepts numbers. Will filter for jobs that have set hourly rate or higher hourly rate.

#### Look For Input

Former Inputs are used to filter jobs. This filter scans through filtered results until it finds a job offer meeting it's requirements. For this it's highly advised to use start and end times of the job.

Example: 

```bash
  10:00 - 22:00
```

Form should look like this before submitting:

  ![Completed form's screenshot](/assets/images/formInputExample.png?raw=true "Optional Title")
#### Stop Bot

```bash
  /stop
```
 Stops scanning.

## Roadmap

- Optimize form input, mostly city input. Allow more than five cities, allow uppercase characters and Lithuanian letters.

- Remove the need to edit config.json. Remove the need to add username and password to run the bot.

- Set bot to public. Allow using it without the need to run it locally.

- Fix memory leak.

