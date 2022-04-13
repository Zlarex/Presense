require('dotenv').config()
const { Client, Message } = require('discord.js')

module.exports = {
    name: 'shutdown',
    description: 'Kills the bot',
    permission: {
        user: [],
        bot: []
    },
    isOwner: false,
    min_args: 0,
    args: [],
    aliases: [],
    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
     run: async(client, message, args) => {
        try
        {
            if (message.author.id != process.env.DEVELOPER_ID) return message.channel.send(`:no_entry: No no no...`)
            await message.react('👋')
            process.exit(0)
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}