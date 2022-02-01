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

    schedule.forEach(sch => {
        cron.schedule(sch.time, async () =>
            {
                const embed = generateSch(sch)
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
            if (args.length < 2) return message.channel.send(`⛔ Invalid Arguments!`)
            let idx = Number(args[0])
            let embed = generateSch(schedule[idx])
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
            if (args.length < 2) return message.channel.send(`⛔ Invalid Arguments!`)
            let msgid = args[0]
            let idxFix = Number(args[1])
            let embed = generateSch(schedule[idxFix])
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

function generateSch(sch) {
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
// client.login(client.token)
keepAlive()

// https://discord.com/api/oauth2/authorize?client_id=886192578767249478&permissions=268635200&scope=bot