const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Tool = require('../models/tool')
const Toolbox = require('../models/toolbox')
const uploadPath = path.join('public',Tool.toolImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
   dest: uploadPath,
   fileFilter: (req, file, callback) => {
     callback(null, imageMimeTypes.includes(file.mimetype))
   }
 })

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
router.post('/', upload.single('toolImage'), async (req,res) => {
   const fileName = req.file != null ? req.file.filename : null
  
   const tool = new Tool({
      name: req.body.name,
      qrCode: req.body.qrCode,
      toolbox: req.body.toolbox,
      createdDate: new Date(req.body.createdDate),
      price: Number(req.body.price),
      available: Boolean(req.body.available),
      borrower: req.body.borrower,
      lastupdateDate: new Date(req.body.createdDate),
      toolImageName: fileName,
      description: req.body.description
   })

   try {
     // console.log("Tool :" + tool)
      const newTool = await tool.save()
     // res.redirect('tools/$(newTool.id)')
      res.redirect(`tools`)
   } catch {
      if (tool.toolImageName != null) {
         removeToolImage(tool.toolImageName)
      } 
      renderNewPage(res, tool, true)

      res.render('tools/new', {
         tool: tool,  
         errorMessage: 'Error creating Tool'
      })
   }
})

function removeToolImage(fileName) {
   fs.unlink(path.join(uploadPath, fileName), err => {
     if (err) console.error(err)
   })
 } 

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
  
module.exports = router