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