const express = require('express');
const app = express();
const port = 3000;


const tasks = require('./endpoints/tasks')
app.use('/tasks', tasks)

app.listen(port, () => {
    console.log(`Der Server startet auf Port ${port}`)
})

