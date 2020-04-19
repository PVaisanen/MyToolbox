const express = require('express')
const router = express.Router()
const Toolbox = require('../models/toolbox')

// All Items Route
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

// New Item Route
router.get('/new', (req,res) => {
    res.render('toolboxes/new', { toolbox: new Toolbox() })
})

// create Item
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