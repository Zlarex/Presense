require('dotenv').config()
const cron = require('node-cron')
const Discord = require('discord.js')
const { keepAlive } = require('./server')
const { decrypt, generate } = require('./gencrypt')

const intent = new Discord.Intents(32767)
const client = new Discord.Client({intents: intent})
client.prefix = process.env.PREFIX
client.token = process.env.BOT_TOKEN

const schedule = JSON.parse(decrypt(`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`))

client.once('ready', async() => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const channel = await guild.channels.cache.get(process.env.PRESENCE_CHANNEL_ID)
    const message = await channel.messages.fetch(process.env.PRESENCE_MESSAGE_ID)
    const role = await guild.roles.fetch(process.env.PRESENCE_ROLE_ID)
    
    client.user.setActivity(`The Schedule`, {type: 'WATCHING'})
    console.log('Info: The bot has been connected!')
    console.log(schedule)

    let i = 0
    schedule.forEach(sch => {
        cron.schedule(sch.time, async () =>
            {
                const embed = generateEmbedData(i)
                let mesg = await channel.send(`<@&${process.env.PRESENCE_ROLE_ID}> Jangan lupa isi presensi:`, {embed})
                mesg.react('✅')
            },
            {
                timezone: 'Asia/Jakarta'
            }
        )
        i++
    })
})

client.on('message', async (message) => {
    if (message.author.id == process.env.DEVELOPER_ID)
    {
        if (!message.content.startsWith('!')) return
        let [cmd, ...args] = message.content.slice(1).trim().split(/ +/g)
        if (cmd == 'spawn')
        {
            const embed = {
                description: `Pilih role berikut untuk mendapatkan notifikasi terkait dengan presensi pada web akademik polban.\n📢 <@&887530161170415676>`
            }
            let msg = await message.channel.send(`__**Notifikasi Presensi**__`, {embed})
            msg.react('📢')
        }
        else if (cmd == 'force')
        {
            if (args.length < 0) return message.channel.send(`⛔ Invalid Arguments!`)
            let idx = Number(args[0])
            let embed = generateEmbedData(idx)
            let mesg = await message.channel.send(`<@&${process.env.PRESENCE_ROLE_ID}> Jangan lupa isi presensi:`, {embed})
            mesg.react('✅')
        }
        else if (cmd == 'ping')
        {
          message.channel.send('Receiving...').then(msg => {
              let createdAt = msg.createdAt - message.createdAt
              let websocketAt = client.ws.ping
              let editedMessage =  `:signal_strength: API: \`${createdAt}\` ms | WebSocket: \`${websocketAt}\` ms`
              msg.edit(editedMessage)
          })
        }
        else if (cmd == 'leave')
        {
          await message.channel.send(`Cya...!`)
          await message.guild.leave()
        }
        else if (cmd == 'edit')
        {
            let msgid = args[0]
            let idxFix = Number(args[1])
            let embed = generateEmbedData(idxFix)
            await message.channel.messages.fetch(msgid).then(m => {
                m.edit(`<@&${process.env.PRESENCE_ROLE_ID}> Jangan lupa isi presensi:`, {embed})
            })
            .catch(e => {
                console.log(`Error: Invalid message!`)
            })
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

// client.on("debug", ( e ) => console.log(e))

function generateEmbedData(idx) {
    let sch = schedule[idx]
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
            text: "Semester 4 ・ Catatan: Notifikasi ini bersifat statis, jadwal pengisian presensi bisa saja berubah."
        }
    }
    return embed
}

client.login(client.token)
keepAlive()

// https://discord.com/api/oauth2/authorize?client_id=886192578767249478&permissions=268635200&scope=bot