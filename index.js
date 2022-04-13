require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const { keepAlive } = require('./server')
const mongoose = require('mongoose')

const intent = new Discord.Intents(32767)
const client = new Discord.Client({intents: intent})
client.prefix = process.env.PREFIX
client.saved_token = process.env.BOT_TOKEN

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.cron = {}

console.log(`Info: Connecting to database`)
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_ADDR}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Info: Database connected')
})
.catch(err => {
    console.trace(err)
})

loadEvents = () => {
    console.log(`Info: Loading event files ...`)
    const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'))
    for (const eventFile of eventFiles)
    {
        const event = require(`./events/${eventFile}`)
        if (event.once) client.once(event.name, event.run.bind(undefined, client))
        else client.on(event.name, event.run.bind(undefined, client))
        console.log(`Info: Event ready: ${event.name}`)
    }
}

loadCommands = () => {
    console.log(`Info: Loading command files ...`)
    const commandFiles = fs.readdirSync(`./commands`).filter(f => f.endsWith('.js'))
    for (const commandFile of commandFiles)
    {
        const command = require(`./commands/${commandFile}`)
        client.commands.set(command.name, command)
        if (command.aliases) command.aliases.forEach(alias => client.aliases.set(alias, command.name))
        console.log(`Info: Command ready: ${commandFile}`)
    }
}

loadEvents()
loadCommands()
client.login(client.saved_token)
keepAlive()

// client.once('ready', async() => {
    // const guild = await client.guilds.fetch(process.env.GUILD_ID)
    // const channel = await guild.channels.cache.get(process.env.PRESENCE_CHANNEL_ID)
    // const message = await channel.messages.fetch(process.env.PRESENCE_MESSAGE_ID)
    // const role = await guild.roles.fetch(process.env.PRESENCE_ROLE_ID)
    
    // client.user.setActivity(`The Schedule`, {type: 'WATCHING'})
    // console.log('Info: The client has been connected!')
    // console.log(schedule)

    // schedule.forEach(sch => {
    //     cron.schedule(sch.time, async () =>
    //         {
    //             const embed = generateSch(sch)
    //             let mesg = await channel.send(`<@&${process.env.PRESENCE_ROLE_ID}> Jangan lupa isi presensi:`, {embed})
    //             mesg.react('✅')
    //         },
    //         {
    //             timezone: 'Asia/Jakarta'
    //         }
    //     )
    // })
// })


// client.on("debug", ( e ) => console.log(e))

// function generateSch(sch) {
//     let fieldd = ''
//     sch.dosen.forEach(d => {
//         fieldd += `:pencil: \`--\` ${d}\n`
//     })
//     const embed = {
//         title: sch.name,
//         description: `:books: \`${sch.kode}\` ・ :alarm_clock: \`${sch.jam}\` ・ :link: [Web Akademik](${process.env.PRESENCE_LINK}) | [Ambil Role](https://discord.com/channels/${process.env.GUILD_ID}/${process.env.PRESENCE_CHANNEL_ID}/${process.env.PRESENCE_MESSAGE_ID})`,
//         fields: [
//             {
//                 name: "Dosen",
//                 value: fieldd,
//             },
//         ],
//         footer: {
//             text: "Semester 4 ・ Catatan: Notifikasi ini bersifat statis, jadwal pengisian presensi bisa saja berubah."
//         }
//     }
//     return embed
// }