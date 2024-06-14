const express = require('express');
const app = express();
const session = require('express-session')
const port = 3000;
const bodyParser = require('body-parser')

app.use(bodyParser.json())


const tasks = require('./endpoints/tasks')
app.use('/tasks', tasks)


app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))


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
        res.status(200).send('Du wurdest erfolgreich eingeloggt')
    } else {
        res.status(403).send('Benutzername oder Passwort falsch')
        req.session.authenticated = false
    }
})

app.listen(port, () => {
    console.log(`Der Server startet auf Port ${port}`)
})

