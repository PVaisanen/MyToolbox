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
        const tools = await query.exec() //Tool.find(searchOptions)
        res.render('tools/index', { 
            tools: tools, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
 //   res.send('All Tools')
})

// New Tool Route
router.get('/new', async (req,res) => {
   renderNewPage(res, new Tool())
  // res.render('tools/new', { tool: new Tool() })
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
           // console.log("Tool :" + tool)
      const newTool = await tool.save()
     // res.redirect('tools/$(newTool.id)')
      res.redirect(`tools`)
   } catch {
      renderNewPage(res, tool, true)

/*       res.render('tools/new', {
         tool: tool,  
         errorMessage: 'Error creating Tool' 
      }) */
   }
})

 async function renderNewPage(res, tool, hasError = false) {
   try {
      
     const toolboxes = await Toolbox.find({})
     const params = {
       toolboxes: toolboxes,
       tool: tool
     }
   
     if (hasError) params.errorMessage = 'Error Creating Tool'
      res.render('tools/new', params)
   } catch {
     console.log("renderNewPage catch")
     res.redirect('/tools')
   }
 }

 function saveImage(tool, imageEncoded) {
    if (imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
       tool.toolImage = new Buffer.from(image.data, 'base64')
       tool.toolImageType = image.type
    }
 }
  
module.exports = router