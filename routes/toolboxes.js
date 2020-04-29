const express = require('express')
const router = express.Router()
const Toolbox = require('../models/toolbox')

// All Toolboxes Route
router.get('/', async (req, res) => {
   let searchOptions = {}
   if (req.query.name != null && req.query.name !== '') {
       searchOptions.name = new RegExp(req.query.name, 'i')
   }
    try {
        const toolboxes = await Toolbox.find(searchOptions)
        res.render('toolboxes/index', { 
            toolboxes: toolboxes, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
})

// New Toolbox Route
router.get('/new', (req,res) => {
    const newToolbox = new Toolbox()
    res.render('toolboxes/new', { toolbox: new Toolbox() })
})

// create Toolbox
router.post('/', async (req, res) => {
    const toolbox = new Toolbox({
        name: req.body.name
    })
    try {
        const newToolbox = await toolbox.save()
         //res.redirect(`toolboxes/${newToolbox.id}`)
        res.redirect(`toolboxes`)
    } catch {
        res.render('toolboxes/new', {
        toolbox: toolbox,  
        errorMessage: 'Error creating Toolbox'
        })
    }
})

module.exports = router