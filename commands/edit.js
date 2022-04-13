require('dotenv').config()
const { Client, Message } = require('discord.js')
const schedule = require('../schemas/schedule')
const config = require('../schemas/config')

module.exports = {
    name: 'edit',
    description: 'Edit the schedule',
    permission: {
        user: [],
        bot: []
    },
    isOwner: true,
    min_args: 2,
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
            let msgid = args[0]
            let id = args[1]
            let doc = await schedule.findById(id)
            let conf = await config.findOne({server_id: message.guild.id})
            let sch = {
                kode: doc.kode_matkul,
                jam: doc.jam_awal + '-' + doc.jam_akhir,
                name: doc.name,
                dosen: doc.dosen,
                server: doc.server_id,
                channel: conf.channel_id,
                role: conf.role_id,
                message: conf.message_id
            }
            let embed = generateSch(sch)
            await message.channel.messages.fetch(msgid)
            .then(m => {
                m.edit(`<@&${sch.role_id}> Jangan lupa isi presensi:`, {embed})
            })
        }
        catch (err)
        {
            console.trace(err)
            message.channel.send(err).catch(() => {})
        }
    }
}

function generateSch(sch) {
    let fieldd = ''
    sch.dosen.forEach(d => {
        fieldd += `:pencil: \`--\` ${d}\n`
    })
    const embed = {
        title: sch.name,
        description: `:books: \`${sch.kode}\` ・ :alarm_clock: \`${sch.jam}\` ・ :link: [Web Akademik](${process.env.PRESENCE_LINK}) | [Ambil Role](https://discord.com/channels/${sch.server}/${sch.channel}/${sch.message})`,
        fields: [
            {
                name: "Dosen",
                value: fieldd,
            },
        ],
        footer: {
            text: "Semester 4 ・ Catatan: Notifikasi ini bersifat statis, jadwal pengisian presensi bisa saja berubah."
        }
    }
    return embed
}