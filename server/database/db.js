//establish connection with postgre
const { Client } = require('pg');

//create new client
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'scheduledDB',
    password: 'Wmlldn2003',
    port: 5432
});

//connect
client.connect((err) =>{
    if(err){
        console.log('Connection error ', err.stack)
    }else{
        console.log("Successfully connected!")
    }
});
module.exports = client;