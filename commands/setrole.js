const { Client, Message } = require('discord.js')
const config = require('../schemas/config')

module.exports = {
    name: 'setrole',
    description: 'Set the notification role',
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
            let role = args[0].replace(/[\\<>&@#!]/g, '')
            if (message.mentions.roles.size > 0) role_id = message.mentions.roles.first().id
            
            let doc = await config.findOneAndUpdate({server_id: message.guild.id}, {role_id: role}, {new: true, upsert: true})
            if (doc) return message.channel.send(`Role presensi berhasil diatur!`)
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}