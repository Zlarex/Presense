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

    let i = 0;
    schedule.forEach(sch => {
        cron.schedule(sch.time, async () =>
            {
                const embed = generateEmbedData(i++);
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
        if (!message.content.startsWith('!')) return;
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
            if (args.length < 0) return message.channel.send(`⛔ Invalid Arguments!`);
            let idx = Number(args[0]);
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

// client.on("debug", ( e ) => console.log(e));

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