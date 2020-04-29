const mongoose = require('mongoose')

const toolboxSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
    }
})

module.exports = mongoose.model('Toolbox', toolboxSchema)