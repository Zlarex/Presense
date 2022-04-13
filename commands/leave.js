const { Client, Message } = require('discord.js')

module.exports = {
    name: 'leave',
    description: 'Leave the server',
    permission: {
        user: [],
        bot: []
    },
    isOwner: true,
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
            await message.channel.send(`:wave: Leaving the server...`)
            await message.guild.leave()
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}