const express = require('express')
const router = express.Router()
const Tool = require('../models/tool')

router.get('/', async (reg, res) => {
    let tools
    try {
        tools = await Tool.find().sort({ lastupdateDate: 'desc'}).limit(8).exec()
    } catch {
        tools = []
    }
    res.render('index', { tools : tools})
})

module.exports = router