const { Client, Message } = require('discord.js')
const config = require('../schemas/config')

module.exports = {
    name: 'setchannel',
    description: 'Set the notification channel',
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
            let channel = message.channel.id
            if (message.mentions.channels.size > 0) channel = message.mentions.channels.first().id
            
            let doc = await config.findOneAndUpdate({server_id: message.guild.id}, {channel_id: channel}, {new: true, upsert: true})
            if (doc) return message.channel.send(`Channel presensi berhasil diatur!`)
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}