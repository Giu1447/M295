const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const booksPath = path.join(__dirname, 'tasks.json')
let tasksList = []

router.use(express.json())

try {
    tasksList = JSON.parse(fs.readFileSync(booksPath, 'utf-8'))
} catch (err) {
    console.error('Fehler beim Lesen von books.json:', err)
}

router.get('/', (req, res) => {
    /*
    #swagger.description = 'Endpunkt um alle Tasks anzuzeigen'
    #swagger.tags = ['Tasks']
    */
    res.status(200).json(tasksList)
})

module.exports = router