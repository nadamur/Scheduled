const jwt = require('jsonwebtoken');
require('dotenv').config();

//create jwt
function jwtGenerator(storeID){
    const payload = {
        user: storeID
    }
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr" });
}

module.exports = jwtGenerator;