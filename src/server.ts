import discord, { VoiceChannel } from 'discord.js';

const client = new discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message) => {
  console.log('received message');
  if (message.content === '/ping') {
    message.channel.send('pong');
    changeChannelTag('');
  }

  if (message.content === '/time') {
    const date = new Date();
    console.log(date.toISOString());
    message.channel.send(date.toISOString());
  }
});

const changeChannelTag = (tag: string) => {
  const SEPARATOR = '-';
  console.log('Changing channel to ' + tag);
  client.channels.cache.each((channel: discord.Channel) => {
    // console.log('channel', channel);
    if (channel.type !== 'voice') {
      return;
    }

    const voiceChannel = channel as VoiceChannel;
    const nameArray = voiceChannel.name.split(SEPARATOR);
    const name = nameArray[0].trim();
    console.log('channel', `>${name}<`);

    if (!tag) {
      voiceChannel.setName(name);
    } else {
      voiceChannel.setName(`${name} ${SEPARATOR} ${tag}`);
    }
  });
};

// Log our bot in using the token from https://discord.com/developers/applications
client.login('');
