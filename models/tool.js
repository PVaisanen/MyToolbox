const mongoose = require('mongoose')
const path = require('path')

 const toolImageBasePath = 'uploads/toolImages'

const toolSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true
    },
    qrCode: {
        type: String,
        required: true
    },
    toolbox: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Toolbox'
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    borrower: {
        type: String,
        required: false
    },
    lastupdateDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    toolImageName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

toolSchema.virtual('toolImagePath').get(function() {
    if (this.toolImageName != null) {
      return path.join('/', toolImageBasePath, this.toolImageName)
    } 
  })

module.exports = mongoose.model('Tool', toolSchema)
module.exports.toolImageBasePath = toolImageBasePath