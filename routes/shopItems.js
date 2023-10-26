const mongoose = require("mongoose");
const {shopItemsCollection} = require("../schema/shopItemsSchema")
const express = require("express");
const router = express.Router();
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
const {isUserLoggedIn, onlyAdmin} = require("./middleware")

router.use(isUserLoggedIn);

router.get("/", async (req, res) => {
    const fetchData = await shopItemsCollection.find();
    res.json(fetchData);
});


router.get("/get-item/:id", async (req, res) => {
    const singleItem = await shopItemsCollection.findById(req.params.id);
    if (!singleItem) return res.status(404).send("User not found");
    res.send(singleItem);
})


router.use(onlyAdmin);

router.post("/add", async (req, res) => {
    const {name, description, price, isInStock } = req.body;

    try {
        const single = await shopItemsCollection.create({
            name,
            description,
            price,
            isInStock,
            user: req.decoded.userId
        })
        
        return res.json({
            isRequestSuccessful: true,
            single
        })
    } catch (error) {
        console.log(error);
    }
    
});

router.patch("/edit/:id", async (req, res) => {
   const {name, description, price, isInstock} = req.body;
    const updatedItem = await shopItemsCollection.findByIdAndUpdate(req.params.id, {
            name,
            description, 
            price, 
            isInstock
    }, {new: true})
    
    res.json({
        "message": "Item updated successfully",
        updatedItem
    });
});


router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const itemDeleted = await shopItemsCollection.findByIdAndDelete(id);
        if (!itemDeleted) {
            return res.status(404).json({message: "Item not Found"});
        }
        res.status(200).send("Item has successfully been deleted deleted");

    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

module.exports = router;