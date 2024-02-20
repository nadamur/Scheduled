//all requests related to schedules
const express = require('express');
const router = express.Router();
const client = require('../database/db');
//every request needs authorization first
const authorize = require('../middleware/authorize');

//------------------STORE OPTIONS-------------------

//------------------TIME FRAMES-------------------
//user does not have the option of inserting new row UNLESS they delete old one
router.post("/timeframes", async (req,res) =>{
    const { number_of_staff, store_id, time_from, time_to, manager, day} = req.body;
    try {
        const store = await client.query(
            "SELECT * FROM timeframes WHERE store_id = $1 AND time_from = $2 AND day = $3", [store_id,time_from,day]
            );
        if (store.rows.length > 0){
            //time_from already exists, must delete first!
            return res.status(401).json("Time frame already in use");
        }
        //insert day into DB
        let newTime = await client.query(
            "INSERT INTO timeframes(number_of_staff, store_id, time_from, time_to, manager, day) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",[number_of_staff,store_id,time_from,time_to,manager,day]
        );
        res.json({time: newTime.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//------------------STORE HOURS------------------
router.post("/hours", async (req,res) =>{
    const { store_id, day, opening_time, closing_time} = req.body;
    try {
        const store = await client.query(
            "SELECT * FROM storehours WHERE store_id = $1 AND day = $2", [store_id,day]
            );
        if (store.rows.length > 0){
            //update if already exists
            const newTime = await client.query(
                "UPDATE storehours SET opening_time = $1, closing_time = $2 WHERE store_id = $3 AND day = $4",
                [opening_time,closing_time,store_id,day]
            );
            res.json({time: newTime.rows[0]});
        }
        //insert day into DB
        let newTime = await client.query(
            "INSERT INTO storehours(store_id, day, opening_time, closing_time) VALUES ($1, $2, $3, $4) RETURNING *",[store_id,day,opening_time,closing_time]
        );
        res.json({time: newTime.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//------------------STAFF------------------
router.post("/register", async (req,res) =>{
    const { position, employee_id, store_id, first_name, last_name} = req.body;
    try {
        const employee = await client.query(
            "SELECT * FROM staff WHERE employee_id = $1", [employee_id]
            );
        if (employee.rows.length > 0){
            //id already exists
            //401 unauthorized
            return res.status(401).json("Employee ID already in use")
        }
        //id doesnt already exist
        //insert employee into DB
        let newEmployee = await client.query(
            "INSERT INTO staff(position, employee_id, store_id, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *",[position,employee_id,store_id,first_name,last_name]
        );
        res.json("Success");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//------------------AVAILABILITY------------------
router.post("/availability", async (req,res) =>{
    const { store_id, day_of_week, employee_id, time_from, time_to} = req.body;
    try {
        const employee = await client.query(
            "SELECT * FROM availability WHERE store_id = $1 AND day_of_week = $2 AND employee_id = $3", [store_id,day_of_week, employee_id]
            );
        if (employee.rows.length > 0){
            //update if already exists
            const newAvailability = await client.query(
                "UPDATE availability SET time_from = $1, time_to = $2 WHERE store_id = $3 AND day_of_week = $4 AND employee_id = $5",
                [time_from,time_to,store_id,day_of_week, employee_id]
            );
            res.json({availability: newAvailability.rows[0]});
        }
        //insert day into DB if not already there
        let newAvailability = await client.query(
            "INSERT INTO availability(store_id, employee_id, day_of_week, time_from, time_to) VALUES ($1, $2, $3, $4, $5) RETURNING *",[store_id,employee_id,day_of_week,time_from,time_to]
        );
        res.json({time: newAvailability.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;