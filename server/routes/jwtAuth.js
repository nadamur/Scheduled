//al requests related to authentication
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const client = require('../database/db');
const jwtGenerator = require('../utils/jwtGenerator');
const authorize = require('../middleware/authorize');
const validInfo = require('../middleware/validInfo');

// -----------------ID HELPER METHODS----------------------
//method to generate new store_id
const generateID = async () =>{
    let newID = await client.query(
        "SELECT MAX(store_id) FROM store"
    );
    return newID.rows[0].max + 1;
} 
//method to find store ID
const getStoreID = async (username) =>{
    let storeID = await client.query(
        "SELECT store_id FROM store WHERE username = $1", [username]
    );
    return storeID.rows[0];
}

// --------------------ROUTES---------------------
//registering
router.post("/register", validInfo, async (req,res) =>{
    const { username, password} = req.body;
    try {
        const user = await client.query(
            "SELECT * FROM store WHERE username ILIKE $1", [username]
            );
        if (user.rows.length > 0){
            //username already exists
            //401 unauthorized
            return res.status(401).json("User already exists")
        }
        //username doesnt exist, hash password
        //salt with complexity of 10, in order to generate unique hashed password
        const salt = await bcrypt.genSalt(10);
        const bcyrptPassword = await bcrypt.hash(password, salt);
        let newID = await generateID();
        //insert user into DB
        let newUser = await client.query(
            "INSERT INTO store(username, password, store_id) VALUES ($1, $2, $3) RETURNING *",[username,bcyrptPassword,newID]
        );
        //generate token
        const token = jwtGenerator(newUser.rows[0].newID);
        res.json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//logging in
router.post("/login", validInfo, async (req,res) =>{
    const { username, password} = req.body;
    try {
        const user = await client.query(
            "SELECT * FROM store WHERE username ILIKE $1", [username]
            );
        if (user.rows.length === 0){
            //username does not exist
            //404 not found
            return res.status(404).json("User not found")
        }
        //username exists, compare to unhashed password
        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );
        //incorrect password
        if (!validPassword){
            return res.status(401).json("Incorrect password");
        }
        //find storeID based on username
        let storeID = await getStoreID(username);
        //generate token
        const token = jwtGenerator(storeID);
        res.json({token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//-------------------VERIFY JWT--------------------
router.post('/verify', authorize, (req,res) =>{
    try{
        res.json(true);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error")
    }
});

module.exports = router;