const mongoose = require('mongoose')

const ConfigSchema = new mongoose.Schema({
    server_id: String,
    channel_id: String,
    role_id: String,
    message_id: String
}, {versionKey: false})

module.exports = mongoose.models.Config || mongoose.model('Config', ConfigSchema)