const mongoose = require('mongoose')

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
    toolImage: {
        type: Buffer,
        required: true
    },
    toolImageType: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: false
    }
})

toolSchema.virtual('toolImagePath').get(function() {
    if (this.toolImage != null && this.toolImageType != null) {
      return `data:${this.toolImageType};charset=utf-8;base64,${this.toolImage.toString('base64')}`
    } 
  })

module.exports = mongoose.model('Tool', toolSchema)