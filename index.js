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
    if (message.author.id != process.env.DEVELOPER_ID) return message.channel.send(`⛔ Dev only!`);
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