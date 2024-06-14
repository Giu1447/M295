const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')

const app = express();
const port = 3000;

app.use(bodyParser.json())

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerFile))


const tasks = require('./endpoints/tasks')
app.use('/tasks', tasks)

app.post('/login', (req, res) => {
    /*
    #swagger.description = 'Endpoint um sich einzuloggen.'
    #swagger.tags = ['Login']
    #swagger.parameters['user'] = {
            in: 'body',
            description: 'User login Details',
            required: true,
            schema: {
                name: 'Giulian',
                password: 'm295'
            }
    }
    */
    const name = req.body.name
    const password = req.body.password

    if (!name || !password) {
        res.status(401).send('Gib zuerst deine Benutzerdaten ein')
        req.session.authenticated = false
        return
    }

    if (password === 'm295') {
        req.session.name = name
        req.session.password = password
        req.session.authenticated = true
        res.status(200).json(name)
    } else {
        res.status(403).send('Benutzername oder Passwort falsch')
        req.session.authenticated = false
    }
})

app.get('/verify', (req, res) => {
    /*
    #swagger.description = 'Endpoint um zu verifizieren ob der User eingeloggt ist.'
    #swagger.tags = ['Verify']
    */
    if (req.session.authenticated === true) {
        res.status(200).json(req.session.authenticated)
    } else {
        res.status(401).send('Du bist nicht eingeloggt')
    }
})

app.delete('/logout', (req, res) => {
    /*
    #swagger.description = 'Endpoint um dem User auzuloggen.'
    #swagger.tags = ['Logout']
    */
    req.session.destroy((err) => {
        if (err) {
            console.error('Fehler beim Ausloggen:', err)
            res.status(500).send('Ein Fehler ist aufgetreten')
        } else {
            res.status(200).send()
        }
    })
})

app.get('/', (req, res) => {
    res.redirect('http://localhost:3000/swagger-ui')
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal Server Error')
})

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});


app.listen(port, () => {
    console.log(`Der Server startet auf Port ${port}`)
})
