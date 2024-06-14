const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const taskPath = path.join(__dirname, 'tasks.json')
let tasksList = []

router.use(express.json())

try {
    tasksList = JSON.parse(fs.readFileSync(taskPath, 'utf-8'))
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

router.post('/', (req, res) => {
    /*
    #swagger.description = 'Einen neuen Task hinzufügen'
    #swagger.tags = ['Tasks']
    #swagger.parameters['task'] = {
            in: 'body',
            description: 'Details zum Task, die id wird automatisch generiert',
            required: true,
            schema: {
                "title": "Task 21"
                "description": "Beschreibung für Task 21",
                "dueDate": "2024-08-21",
                "resolvedDate": null
            }
    }
    */
    try {
        const newTask = req.body

        const newId = tasksList.length + 1

        req.body.id = newId

        tasksList.push(newTask)
        fs.writeFileSync(taskPath, JSON.stringify(tasksList, null, 2))
        res.status(201).json(tasksList[newId - 1])
    } catch (err) {
        console.error('Fehler beim Hinzufügen eines Tasks:', err)
        res.status(500).send('Das hat nicht funktioniert')
    }
})




module.exports = router