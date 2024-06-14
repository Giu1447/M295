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
    console.error('Fehler beim Lesen von tasks.json:', err)
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

        if (!newTask.title || !newTask.description || !newTask.dueDate || newTask.resolvedDate) {
            res.status(422).send('Sie müssen alles aktualisieren')
        } else {
            tasksList.push(newTask)
            fs.writeFileSync(taskPath, JSON.stringify(tasksList, null, 2))
            res.status(201).json(tasksList[newId - 1])
        }
    } catch (err) {
        console.error('Fehler beim Hinzufügen eines Tasks:', err)
        res.status(500).send('Das hat nicht funktioniert')
    }
})


router.get('/:id', (req, res) => {
    /*
    #swagger.description = 'Ein Task nach id anzeigen'
    #swagger.tags = ['Tasks']
    #swagger.parameters['id'] = {
            in: 'path',
            description: 'id of the Task.',
            required: true,
            type: 'int'
    }
    */
    const id = req.params.id
    const task = tasksList.find(task => task.id === parseInt(id))

    if (!task) {
        res.status(404).send('Task nicht gefunden')
    } else {
        res.status(200).json(task)
    }
})


router.put('/:id', (req, res) => {
    /*
    #swagger.description = 'Ein Task bearbeiten'
    #swagger.tags = ['Tasks']
    #swagger.parameters['id'] = {
            in: 'path',
            description: 'id von dem Task um ihn zu aktualisieren',
            required: true,
            type: 'int'
    }
    #swagger.parameters['task'] = {
            in: 'body',
            description: 'Details zum Task der aktualisiert werden muss',
            required: true,
            schema: {
                "title": "Updated Title",
                "description": "Updated description",
                "dueDate": "Updated Publisher",
                "resolvedDate": 2024
            }
    }
    */
    try {
        const updateid = req.params.id
        const updateIndex = tasksList.findIndex(task => task.id === parseInt(updateid))

        if (updateIndex === -1) {
            res.status(404).send('Task nicht gefunden')
            return
        }

        tasksList[updateIndex] = req.body
        fs.writeFileSync(taskPath, JSON.stringify(tasksList, null, 2))

        res.status(200).json(tasksList[updateIndex])
    } catch (error) {
        console.error('Fehler beim Aktualisieren eines Tasks:', error)
        res.status(500).send('Ein Fehler ist aufgetreten')
    }
})


router.patch('/:id', (req, res) => {
    /*
    #swagger.tags = ['Tasks']
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'Details zum Task um ihn teilweise zu aktualisieren.',
    required: true,
    schema: {
        type: 'object',
        properties: {
        "title": { type: 'string', description: 'Updated Title (optional)' },
        "description": { type: 'string', description: 'Updated description (optional)' },
        "dueDate": { type: 'string', description: 'Updated dueDate (optional)' },
        "resolvedDate": { type: 'string', description: 'Updated resolvedDate (optional)' }
    }
  }
}
*/
    try {
        const updateid = req.params.id
        const newupdateTask = req.body
        const updateTask = tasksList.find(task => task.id === parseInt(updateid))

        if (!updateTask) {
            return res.status(404).send('Buch nicht gefunden')
        }

        if (newupdateTask.title) {
            updateTask.title = newupdateTask.title
        }

        if (newupdateTask.author) {
            updateTask.author = newupdateTask.author
        }

        if (newupdateTask.year) {
            updateTask.year = newupdateTask.year
        }

        fs.writeFileSync(taskPath, JSON.stringify(tasksList, null, 2))
        res.status(200).json(updateTask)
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Tasks:', error)
        res.status(500).send('Ein Fehler ist aufgetreten')
    }
})

router.delete('/:id', (req, res) => {
    /*
    #swagger.description = 'Ein Task nach der id löschen'
    #swagger.tags = ['Tasks']
    #swagger.parameters['id'] = {
            in: 'path',
            description: 'id von dem Buch was gelöscht werden soll.',
            required: true,
            type: 'int'
    }
    */
    try {
        const deleteIndex = tasksList.findIndex(t => t.id === parseInt(req.params.id))

        if (deleteIndex === -1) {
            res.status(404).send('Task nicht gefunden')
        } else {
            tasksList.splice(deleteIndex, 1)
            fs.writeFileSync(taskPath, JSON.stringify(tasksList, null, 2))
            res.status(200).send('Der Task wurde erfolgreich gelöscht')
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Tasks:', error)
        res.status(500).send('Ein Fehler ist aufgetreten')
    }
})

module.exports = router