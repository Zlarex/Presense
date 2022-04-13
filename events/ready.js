require("dotenv").config()
const config = require('../schemas/config')
const schedule = require('../schemas/schedule')
const cron = require('node-cron')
const { Client, Message, Collection } = require('discord.js')

module.exports = {
    name: 'ready',
    /**
     * @param {Client} client
     * @param {Collection} cacheconfig
     */
    run: async(client) => {
        let doc = await config.find({
            channel_id: {$ne: null},
            role_id: {$ne: null},
            message_id: {$ne: null}
        })
        for (let i = 0; i < doc.length; i++)
        {
            const guild = await client.guilds.fetch(doc[i].server_id)
            const channel = await guild.channels.cache.get(doc[i].channel_id)
            const message = await channel.messages.fetch(doc[i].message_id)
            const role = await guild.roles.fetch(doc[i].role_id)
            const docc = await schedule.find({server_id: guild.id})
            docc.forEach(d => {
                const cr = cron.schedule(d.time, async () =>
                {
                    let conf = await config.findOne({server_id: guild.id})
                    let sch = {
                        kode: d.kode_matkul,
                        jam: d.jam_awal + '-' + d.jam_akhir,
                        name: d.name,
                        dosen: d.dosen,
                        server: d.server_id,
                        channel: conf.channel_id,
                        role: conf.role_id,
                        message: conf.message_id,
                    }
                    const embed = generateSch(sch)
                    let mesg = await channel.send(`<@&${sch.role}> Jangan lupa isi presensi:`, {embed})
                    mesg.react('✅')
                },
                {
                    timezone: 'Asia/Jakarta'
                }
                )
                client.cron[d._id] = cr
            })
        }
        console.log('Info: Bot is ready')
        client.user.setActivity(`The Schedule`, {type: 'WATCHING'})
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