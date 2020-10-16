import { Client, Message } from 'discord.js';

export const pingCommand = (client: Client, message: Message) => {
  console.log('pingCommand');

  return message.reply('pong');
};
