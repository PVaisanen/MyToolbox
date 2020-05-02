const express = require('express')
const router = express.Router()
const Toolbox = require('../models/toolbox')
const Tool = require('../models/tool')

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
    //const newToolbox = new Toolbox()
    res.render('toolboxes/new', { toolbox: new Toolbox() })
})

// create Toolbox
router.post('/', async (req, res) => {
    const toolbox = new Toolbox({
        name: req.body.name
    })
    try {
        const newToolbox = await toolbox.save()
        res.redirect(`toolboxes`)
    } catch {
        res.render('toolboxes/new', {
        toolbox: toolbox,  
        errorMessage: 'Error creating Toolbox'
        })
    }
})

// show Toolbox route
router.get('/:id', async (req,res) => {
    try {
        const toolbox = await Toolbox.findById(req.params.id)
        const tools = await Tool.find({ toolbox: toolbox.id }).limit(10).exec()
        res.render('toolboxes/show', {
            toolbox: toolbox,
            toolsInToolbox: tools
        })
    } catch  {
       
        res.redirect('/')
    }
})

// edit Toolbox route
router.get('/:id/edit', async (req, res) => {
    try {
        const toolbox = await Toolbox.findById(req.params.id)
        res.render('toolboxes/edit', {toolbox: toolbox })
    } catch {
        res.redirect(`/toolboxes`)
    }
})

// update
router.put('/:id', async (req, res) => {
    let toolbox
    try {
        toolbox = await Toolbox.findById(req.params.id)
        toolbox.name = req.body.name
        await toolbox.save()
         res.redirect(`/toolboxes/${toolbox.id}`)
    } catch {
        if(toolbox == null) {
            res.redirect('/')
        } else {
            res.render('toolboxes/edit', {
                toolbox: toolbox,  
                errorMessage: 'Error updating Toolbox'
            })
        }
    }
})

//delete
router.delete('/:id', async (req, res) => {
    let toolbox
    try {
         toolbox = await Toolbox.findById(req.params.id)
         await toolbox.remove()
         res.redirect('/toolboxes')
    } catch {
        if(toolbox == null) {
            res.redirect('/')
        } else {
            res.redirect(`toolboxes/${toolbox.id}`)
        }
    }
})

module.exports = router