const express = require('express')
const router = express.Router()
const Tool = require('../models/tool')
const Toolbox = require('../models/toolbox')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Tools Route
router.get('/', async (req, res) => {
   let query = Tool.find()

   if (req.query.name != null && req.query.name !== '') {
      query =  query.regex('name', new RegExp(req.query.name, 'i'))
   }

   if (req.query.qrCode != null && req.query.qrCode !== '') {
      query =  query.regex('qrCode', new RegExp(req.query.qrCode, 'i'))
  }
      try {
        const tools = await query.exec()
        res.render('tools/index', { 
            tools: tools, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
})

// New Tool Route
router.get('/new', async (req,res) => {
   renderNewPage(res, new Tool())
})

// create Tool route
router.post('/', async (req,res) => {
     const tool = new Tool({
      name: req.body.name,
      qrCode: req.body.qrCode,
      toolbox: req.body.toolbox,
      createdDate: new Date(req.body.createdDate),
      price: Number(req.body.price),
      available: Boolean(req.body.available),
      borrower: req.body.borrower,
      lastupdateDate: new Date(req.body.createdDate),
      description: req.body.description
   })
   saveImage(tool,req.body.toolImage)

   try {
      const newTool = await tool.save()
      res.redirect(`tools/${newTool.id}`)
   } catch {
      renderNewPage(res, tool, true)
   }
})

async function renderNewPage(res, tool, hasError = false) {
   renderFormPage(res, tool, 'new', hasError)
}

async function renderEditPage(res, tool, hasError = false) {
   renderFormPage(res, tool, 'edit', hasError)
}
// Delete router
router.delete('/:id', async (req, res) => {
   let tool
   try {
      tool = await Tool.findById(req.params.id)
      await tool.remove()
      res.redirect('/tools')
   } catch {
      if (tool != null) {
         res.render('/tools/show', {
            tool: tool,
            errorMessage: 'Could not remove tool'
         })
      } else {
         res.redirect('/')
      }
   }
})

async function renderFormPage(res, tool, form, hasError = false) {
   try {
     const toolboxes = await Toolbox.find({})
     const params = {
       toolboxes: toolboxes,
       tool: tool
   }
   if (hasError) {
      if (form === 'edit') {
         params.errorMessage = 'Error editing Tool'
      } else {
         params.errorMessage = 'Error creating Tool'
      }
   }
     res.render(`tools/${form}`, params)
   } catch {
      res.redirect('/tools')
   }
 }

 // update Tool route
router.put('/:id', async (req,res) => {
   let tool
        
 try {
   tool = await Tool.findById(req.params.id)
   tool.name = req.body.name
   tool.qrCode = req.body.qrCode
   tool.toolbox = req.body.toolbox
   tool.createdDate = new Date(req.body.createdDate)
   tool.price = req.body.price
   tool.available = req.body.available
   tool.borrower = req.body.borrower
   tool.description = req.body.description
   tool.lastupdateDate = Date.now()

   if (req.body.toolImage != null && req.body.toolImage !== '') {
      saveImage(tool, req.body.toolImage)
   }
   await tool.save()
   res.redirect(`/tools/${tool.id}`)
 } catch {
    if ( tool != null ) {
      renderEditPage(res, tool, true)
    } else {
      redirect('/')
    }
 }
})

 // Show Tool route
router.get('/:id', async (req, res) => {
   try {
     const tool = await Tool.findById(req.params.id).populate('toolbox').exec()
     res.render('tools/show', { tool: tool })
   } catch {
     res.redirect('/')
   }
 })

 // Edit Tool Route
router.get('/:id/edit', async (req,res) => {
   try {
      const tool = await Tool.findById(req.params.id)
      renderEditPage(res, tool)
      
   } catch {
      res.redirect('/')
   }
})

function saveImage(tool, imageEncoded) {
    if (imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
       tool.toolImage = new Buffer.from(image.data, 'base64')
       tool.toolImageType = image.type
    }
}
  
module.exports = router