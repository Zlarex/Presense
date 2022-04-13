const { Client, Message } = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Get the command list',
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
            let cmd = []
            client.commands.forEach(c => {
                cmd.push(c.name)
            })
            message.channel.send(`Commands: \`\`\`\n${cmd.join(', ')}\n\`\`\``)
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}