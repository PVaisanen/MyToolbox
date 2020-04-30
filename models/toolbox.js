const mongoose = require('mongoose')
const Tool = require('./tool')

const toolboxSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
    }
})

toolboxSchema.pre('remove', function(next) {
    Tool.find({ toolbox: this.id }, (err, tools) => {

        console.log("pre id: " + this.id)

        if (err) {
            next(err)
        } else if (tools.length > 0) {
            next(new Error('This toolbox has tools'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Toolbox', toolboxSchema)