require('dotenv').config()
const { Client, MessageReaction, User } = require("discord.js")
const config = require('../schemas/config')

module.exports = {
    name: 'messageReactionRemove',
    /**
     * 
     * @param {Client} client 
     * @param {MessageReaction} reaction 
     * @param {User} user 
     * @returns 
     */
    run: async(client, reaction, user) => {
        try
        {
            if (reaction.emoji.name != '📢') return
            let doc = await config.findOne({server_id: reaction.message.guild.id})
            if (reaction.message.id == doc.message_id)
            {
                if (doc)
                {
                    const member = reaction.message.guild.member(user.id)
                    const role = member.guild.roles.cache.get(doc.role_id)
                    member.roles.remove(role)
                }
            }
        }
        catch(err)
        {
            console.trace(err)
        }
      }
}