require('dotenv').config()
const cron = require('node-cron')
const Discord = require('discord.js')
const { keepAlive } = require('./server')
const { decrypt, generate } = require('./gencrypt')

const intent = new Discord.Intents(32767)
const client = new Discord.Client({intents: intent})
client.prefix = process.env.PREFIX
client.token = process.env.BOT_TOKEN

const schedule = JSON.parse(decrypt(process.env.SCHEDULE))

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

client.on('debug', async (msg) => {
  console.log(msg)
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
        await message.react('👋')
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
        description: `:books: \`${sch.kode}\` ・ :alarm_clock: \`${sch.jam} #Ramadhan\` ・ :link: [Web Akademik](${process.env.PRESENCE_LINK}) | [Ambil Role](https://discord.com/channels/${process.env.GUILD_ID}/${process.env.PRESENCE_CHANNEL_ID}/${process.env.PRESENCE_MESSAGE_ID})`,
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