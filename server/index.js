const express = require('express');
const app = express();
const cors = require('cors');

//middleware
app.use(express.json());
app.use(cors());

//routes
//authentication related
app.use('/auth', require('./routes/jwtAuth'));
//schedule related
app.use('/schedule', require('./routes/schedule'));


//listen on port 5000
app.listen(5000, () =>{
    console.log('Server running on port 5000')
})