const express = require('express')
const router = express.Router()
const Toolbox = require('../models/toolbox')
// All Items Route
router.get('/', (reg, res) => {
    res.render('toolboxes/index')
})

// New Item Route
router.get('/new', (req,res) => {
    res.render('toolboxes/new', { toolbox: new Toolbox() })
})

// create Item
router.post('/', (req, res) => {
    const toolbox = new Toolbox({
        name: req.body.name
    })
   
    toolbox.save((err, newToolbox) => {
        if (err) {
            res.render('toolboxes/new', {
              toolbox: toolbox,  
              errorMessage: 'Error creating Toolbox'
            })
        } else {
        //res.redirect(`toolboxes/${newToolbox.id}`)
        res.redirect(`toolboxes`)
        }
    })
})

module.exports = router