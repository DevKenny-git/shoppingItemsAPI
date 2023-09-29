const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const router = express.Router();
require("dotenv").config();
const {userCollection} = require("../schema/userSchema");
const {isUserLoggedIn} = require("./middleware")


router.post('/register', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);

        const {fullName, username, password, role} = req.body;
        const hashedPassword = bcrypt.hashSync(password, salt);

        await userCollection.create({
            fullName,
            username,
            password: hashedPassword,
            role
        });

        res.status(201).send("User Successfully Created");

    } catch (error) {
        console.log(error)
    }
    
})


router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const userDetail = await userCollection.findOne({username});

        if (!userDetail) return res.status(404).send("User not Found");

        const doesPasswordMatch = bcrypt.compareSync(password, userDetail.password);

        if (!doesPasswordMatch) return res.status(400).send("Invalid Credentials");

        const {username: userValue, _id, role} = userDetail;
        const token = jwt.sign({
            username: userValue,
            userId: _id,
            role
        }, process.env.secret);
        res.send({
            message: "Sign in Successful",
            token
        })
    } catch (error) {
        console.log(error);
    }
});


router.get("/profile", isUserLoggedIn, async (req, res) => {
    console.log(req.decoded);
    try {        
        const user = await userCollection.findById(req.decoded.userId, "-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;
