const { Client, Message } = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'Check the bot\'s latency',
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
            message.channel.send('Receiving...').then(msg => {
                let createdAt = msg.createdAt - message.createdAt
                let websocketAt = client.ws.ping
                let editedMessage =  `:signal_strength: API: \`${createdAt}\` ms | WebSocket: \`${websocketAt}\` ms`
                msg.edit(editedMessage)
            })
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}