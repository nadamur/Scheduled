const express = require('express');
const app = express();

//middleware
app.use(express.json());

//routes
//user related
app.use('/auth', require('./routes/jwtAuth'));


//listen on port 5000
app.listen(5000, () =>{
    console.log('Server running on port 5000')
})