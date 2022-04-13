const { Client, Message } = require('discord.js')
const schedule = require('../schemas/schedule')

module.exports = {
    name: 'delete',
    description: 'Delete a schedule',
    permission: {
        user: [],
        bot: []
    },
    isOwner: true,
    min_args: 1,
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
            let id = args[0]
            if (id.toLowerCase() == 'all')
            {
                const list = await schedule.find({server_id: message.guild.id})
                list.forEach(l => {
                    let cr = client.cron[l._id]
                    cr.stop()
                    delete client.cron[l._id]
                })
                schedule.deleteMany({server_id: message.guild.id}, (err, d) => {
                    if (d.deletedCount > 0) message.channel.send(`Jadwal berhasil dihapus`)
                    else message.channel.send(`Gagal menghapus jadwal`)
                })
            }
            else
            {
                schedule.deleteOne({server_id: message.guild.id, _id: id}, (err, d) => {
                    if (d.deletedCount == 1)
                    {
                        message.channel.send(`Jadwal berhasil dihapus`)
                        let cr = client.cron[id]
                        cr.stop()
                        delete client.cron[l._id]
                    }
                    else message.channel.send(`Gagal menghapus jadwal`)
                })
            }
            
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}