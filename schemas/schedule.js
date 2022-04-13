const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
    server_id: String,
    name: String,
    time: String,
    kode_matkul: String,
    jam_awal: String,
    jam_akhir: String,
    dosen: Array
}, {versionKey: false})

module.exports = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema)