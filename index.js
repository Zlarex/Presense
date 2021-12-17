require('dotenv').config()
const cron = require('node-cron')
const Discord = require('discord.js')
const { keepAlive } = require('./server')
const { decrypt } = require('./gencrypt')

const intent = new Discord.Intents(32767)
const client = new Discord.Client({intents: intent})
client.prefix = process.env.PREFIX
client.token = process.env.BOT_TOKEN

client.once('ready', async() => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const channel = await guild.channels.cache.get(process.env.PRESENCE_CHANNEL_ID)
    const message = await channel.messages.fetch(process.env.PRESENCE_MESSAGE_ID)
    const role = await guild.roles.fetch(process.env.PRESENCE_ROLE_ID)
    
    client.user.setActivity(`The Schedule`, {type: 'WATCHING'})
    console.log('Info: The bot has been connected!')

    const schedule = JSON.parse(decrypt('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'))

    console.log(schedule)

    schedule.forEach(sch => {
        cron.schedule(sch.time, async () =>
            {
                let fieldd = ''
                sch.dosen.forEach(d => {
                    fieldd += `:pencil: \`--\` ${d}\n`
                })
                const embed = {
                    title: sch.name,
                    description: `:books: \`${sch.kode}\` ・ :alarm_clock: \`${sch.jam}\` ・ :link: [Web Akademik](${process.env.PRESENCE_LINK}) | [Ambil Role](https://discord.com/channels/${process.env.GUILD_ID}/${process.env.PRESENCE_CHANNEL_ID}/${process.env.PRESENCE_MESSAGE_ID})`,
                    fields: [
                        {
                            name: "Dosen",
                            value: fieldd,
                        },
                    ],
                    footer: {
                        text: "Semester 3 ・ Catatan: Notifikasi ini bersifat statis, jadwal pengisian presensi bisa saja berubah."
                    }
                }
                let mesg = await channel.send(`<@&${process.env.PRESENCE_ROLE_ID}> Jangan lupa isi presensi:`, {embed})
                mesg.react('✅')
            },
            {
                timezone: 'Asia/Jakarta'
            }
        )
    })
})

client.on('message', async (message) => {
    if (message.author.id == process.env.DEVELOPER_ID)
    {
        if (message.content == '!spawn')
        {
            const embed = {
                description: `Pilih role berikut untuk mendapatkan notifikasi terkait dengan presensi pada web akademik polban.\n📢 <@&887530161170415676>`
            }
            let msg = await message.channel.send(`__**Notifikasi Presensi**__`, {embed})
            msg.react('📢')
        }
        else if (message.content == '!force')
        {
            let fieldd = ''
            const schedule = JSON.parse(decrypt('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'))
            let sch = schedule[9]
            sch.dosen.forEach(d => {
                fieldd += `:pencil: \`--\` ${d}\n`
            })
            const embed = {
                title: sch.name,
                description: `:books: \`${sch.kode}\` ・ :alarm_clock: \`${sch.jam}\` ・ :link: [Web Akademik](${process.env.PRESENCE_LINK}) | [Ambil Role](https://discord.com/channels/${process.env.GUILD_ID}/${process.env.PRESENCE_CHANNEL_ID}/${process.env.PRESENCE_MESSAGE_ID})`,
                fields: [
                    {
                        name: "Dosen",
                        value: fieldd,
                    },
                ],
                footer: {
                    text: "Semester 3 ・ Catatan: Notifikasi ini bersifat statis, jadwal pengisian presensi bisa saja berubah."
                }
            }

            let mesg = await message.channel.send(`<@&${process.env.PRESENCE_ROLE_ID}> Jangan lupa isi presensi:`, {embed})
            mesg.react('✅')
        }
        else if (message.content == '!ping')
        {
          message.channel.send('Receiving...').then(msg => {
              let createdAt = msg.createdAt - message.createdAt
              let websocketAt = client.ws.ping
              let editedMessage =  `:signal_strength: API: \`${createdAt}\` ms | WebSocket: \`${websocketAt}\` ms`
              msg.edit(editedMessage)
          })
        }
        else if (message.content == '!leave')
        {
          await message.channel.send(`Cya...!`)
          await message.guild.leave()
        }
    }
})

client.on('messageReactionAdd', async(reaction, user) => {
    if (reaction.message.id == process.env.PRESENCE_MESSAGE_ID)
    {
        let roleID = null
        switch (reaction.emoji.name)
        {
        case '📢':
            roleID = process.env.PRESENCE_ROLE_ID
            break
        }
        if (roleID)
        {
            try
            {
                const member = reaction.message.guild.member(user.id)
                const role = member.guild.roles.cache.get(roleID)
                member.roles.add(role)
            }
            catch(err)
            {
                console.log(`Error: ${err}`)
            }
        }
    }
})

client.on('messageReactionRemove', async(reaction, user) => {
    if (reaction.message.id == process.env.PRESENCE_MESSAGE_ID)
    {
        let roleID = null
        switch (reaction.emoji.name)
        {
            case '📢':
                roleID = process.env.PRESENCE_ROLE_ID
                break
            default:
                return
        }
        if (roleID)
        {
            try
            {
                const member = reaction.message.guild.member(user)
                const role = member.guild.roles.cache.get(roleID)
                member.roles.remove(role)
            }
            catch(err)
            {
                console.log(`Error: ${err}`)
            }
        }
    }
})

client.on("debug", ( e ) => console.log(e));

client.login(client.token)
keepAlive()

// https://discord.com/api/oauth2/authorize?client_id=886192578767249478&permissions=268635200&scope=bot