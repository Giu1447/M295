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
    if (req.session.authenticated === true) {
        res.status(200).json(tasksList)
    } else {
        res.status(403).send('Access Denied');
    }

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
                "title": "Task 21",
                "description": "Beschreibung für Task 21",
                "dueDate": "2024-08-21",
                "resolvedDate": null
            }
    }
    */
    if (req.session.authenticated === true) {
        try {
            const newTask = req.body;

            const maxId = Math.max(...tasksList.map(task => task.id));
            newTask.id = maxId + 1;

            if (!newTask.title || !newTask.description || !newTask.dueDate || newTask.resolvedDate) {
                res.status(422).send('Sie müssen alle Felder ausfüllen');
            } else {
                tasksList.push(newTask);
                fs.writeFileSync(taskPath, JSON.stringify(tasksList, null, 2));
                res.status(201).json(newTask);
            }
        } catch (err) {
            console.error('Fehler beim Hinzufügen eines Tasks:', err);
            res.status(500).send('Das hat nicht funktioniert');
        }
    } else {
        res.status(403).send('Access Denied');
    }
});


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
    if (req.session.authenticated === true) {
        const id = req.params.id
        const task = tasksList.find(task => task.id === parseInt(id))

        if (!task) {
            res.status(404).send('Task nicht gefunden')
        } else {
            res.status(200).json(task)
        }
    } else {
        res.status(403).send('Access Denied');
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
    if (req.session.authenticated === true) {
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
    } else {
        res.status(403).send('Access Denied');
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
                "title": "Updated Title",
                "description": "Updated description",
                "dueDate": "Updated Publisher",
                "resolvedDate": 2024
            }
  }
}
*/

    if (req.session.authenticated === true) {
        try {
            const updateid = req.params.id
            const newupdateTask = req.body
            const updateTask = tasksList.find(task => task.id === parseInt(updateid))

            if (!updateTask) {
                return res.status(404).send('Task nicht gefunden')
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
    } else {
        res.status(403).send('Access Denied');
    }

})

router.delete('/:id', (req, res) => {
    /*
    #swagger.description = 'Ein Task nach der id löschen'
    #swagger.tags = ['Tasks']
    #swagger.parameters['id'] = {
            in: 'path',
            description: 'id von dem Task was gelöscht werden soll.',
            required: true,
            type: 'int'
    }
    */
    if (req.session.authenticated === true) {
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
    } else {
        res.status(403).send('Access Denied');
    }

})

module.exports = router