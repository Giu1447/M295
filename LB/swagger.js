const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API für M295',
        description: 'API Dokumentation die LB-B',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    tags: [
        {
            name: 'Login',
            description: 'User Login'
        },
        {
            name : 'Verify',
            description : 'Loginstatus anschauen'
        },
        {
            name: 'Tasks',
            description: 'Tasks verwalten'
        },
        {
            name : 'Logout',
            description : 'User Logout'
        }
    ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server'); 
});
