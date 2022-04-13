const { Client, Message } = require('discord.js')
const schedule = require('../schemas/schedule')
const config = require('../schemas/config')
const cron = require('node-cron')

module.exports = {
    name: 'insert',
    description: 'Insert a new schedule',
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
            let split0 = args.join(' ').split('"')
            let name = split0[1]
            let split1 = args.join(' ').slice(name.length + 2 + 1).split(' ')
            let kode_matkul = split1[0]
            let jam_awal = split1[1].split('-')[0]
            let jam_akhir = split1[1].split('-')[1]
            let dosen = split0[3].split('&')

            let data = {
                server_id: message.guild.id,
                name: name,
                time: split0[5],
                kode_matkul: kode_matkul,
                jam_awal: jam_awal,
                jam_akhir: jam_akhir,
                dosen: dosen
            }

            let doc = new schedule(data)
            doc.save().then(result => {
                if (result)
                {
                    message.channel.send(`Jadwal berhasil ditambahkan`).then(() => {
                        const cr = cron.schedule(data.time, async () =>
                        {
                            console.log('Info: Executed (from insertion)')
                            let conf = await config.findOne({server_id: message.guild.id})
                            let sch = {
                                kode: data.kode_matkul,
                                jam: data.jam_awal + '-' + data.jam_akhir,
                                name: data.name,
                                dosen: data.dosen,
                                server: data.server_id,
                                channel: conf.channel_id,
                                role: conf.role_id,
                                message: conf.message_id,
                            }
                            const embed = generateSch(sch)
                            let mesg = await message.guild.channels.cache.get(conf.channel_id).send(`<@&${sch.role}> Jangan lupa isi presensi:`, {embed}).catch((err) => { console.trace(err)})
                            mesg.react('✅')
                        },
                        {
                            timezone: 'Asia/Jakarta'
                        }
                        )
                        client.cron[result._id] = cr
                    })
                }
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