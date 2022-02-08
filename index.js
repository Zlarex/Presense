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
    if (!message.content.startsWith('!')) return
    if (message.author.id != process.env.DEVELOPER_ID && message.channel.id == process.env.PRESENCE_CHANNEL_ID) return message.channel.send(`⛔ Dev only!`);
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
        if (args.length < 1) return message.channel.send(`⛔ Invalid Arguments!`)
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
    else if (cmd == 'shutdown')
    {
        process.exit(0)
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
client.login(client.token)
keepAlive()

// https://discord.com/api/oauth2/authorize?client_id=886192578767249478&permissions=268635200&scope=bot