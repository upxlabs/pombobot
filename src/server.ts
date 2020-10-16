import discord, { VoiceChannel } from 'discord.js';
import { config } from 'dotenv';

const client = new discord.Client();
const pomodoroTime = 25 * 60 * 1000;
const shortBreakTime = 5 * 60 * 1000;

client.on('ready', () => {
  console.log('I am ready!');
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message) => {
  console.log('received message');
  if (message.content === '/ping') {
    message.channel.send('pong');
  }

  if (message.content === '/start') {
    startPomo();
  }

  if (message.content === '/time') {
    const date = new Date();
    console.log(date.toISOString());
    message.channel.send(date.toISOString());
  }
});

const startPomo = () => {
  changeChannelTag('🍅');
  sendPruuPruuSound();
  setTimeout(() => {
    shortBreak();
  }, pomodoroTime);
};

const shortBreak = () => {
  changeChannelTag('☕️');
  sendPruuPruuSound();
  setTimeout(() => {
    startPomo();
  }, shortBreakTime);
};

const changeChannelTag = async (tag: string) => {
  const SEPARATOR = '-';

  await Promise.all(
    client.channels.cache.map(async (channel) => {
      if (channel.type !== 'voice') {
        return;
      }

      const voiceChannel = channel as VoiceChannel;
      const nameArray = voiceChannel.name.split(SEPARATOR);
      const name = nameArray[0].trim();

      if (!tag) {
        voiceChannel.setName(name);
      } else {
        console.log(
          'Trying changing channel to ' + `${name} ${SEPARATOR} ${tag}`
        );

        await voiceChannel
          .setName(`${name} ${SEPARATOR} ${tag}`)
          .then(() => console.log(`Ok channel ${name} changed to ${tag}`))
          .catch(console.error);
      }
    })
  );
};

const sendPruuPruuSound = async () => {
  const channels = client.channels.cache.map((channel) => channel);

  for (const channel of channels) {
    console.log(channel.type);

    if (channel.type !== 'voice') {
      continue;
    }

    const voiceChannel = channel as VoiceChannel;
    console.log(`joining ${voiceChannel.name}`);
    const connection = await voiceChannel.join();
    const dispatcher = connection.play(`${process.cwd()}/assets/pru.mp3`);

    dispatcher.setVolume(2);

    const promise = new Promise((resolve, reject) => {
      dispatcher.on('finish', () => {
        console.log('finished');
        voiceChannel.leave();
        dispatcher.destroy();
        resolve();
      });
    });

    await promise;
    await new Promise((res) => setTimeout(res, 3000));
  }
};

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.DISCORD_TOKEN ?? config().parsed?.DISCORD_TOKEN);
