const { Client, Message } = require('discord.js')
const schedule = require('../schemas/schedule')

module.exports = {
    name: 'listschedule',
    description: 'Get the list of the server schedule',
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
            let doc = await schedule.find({server_id: message.guild.id})
            if (doc.length > 0)
            {
                let arr = []
                doc.forEach(d => {
                    let day = getDay(d.time.split(' ')[4].toUpperCase())
                    arr.push(`\`[ID: ${d._id}]\` \`[${day}]\` \`[${d.jam_awal}-${d.jam_akhir}]\` \n${d.name}\n`)
                })
                
                let embed = {
                    description: arr.join(' ')
                }
                message.channel.send(`Daftar jadwal server`, {embed})
            }
            else message.channel.send(`Tidak ada satu pun jadwal yang tersedia`)
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    },
}

/**
 * @param {String} day
 */
function getDay(day)
{
    let d = '???'
    switch (day) {
        case 'SUN': d = 'Minggu'
            break
        case 'MON': d = 'Senin'
            break
        case 'TUE': d = 'Selasa'
            break
        case 'WED': d = 'Rabu'
            break
        case 'THU': d = 'Kamis'
            break
        case 'FRI': d = 'Jum\'at'
            break
        case 'SAT': d = 'Sabtu'
            break
    }
    return d
}