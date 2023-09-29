const express = require('express');
const app = express();
const authRoute = require("./routes/auth");
const mongoose = require('mongoose');
require("dotenv").config();
const port = 3000 || process.env.PORT;
const shopRoute = require("./routes/shopItems");


const connect = mongoose.connect(process.env.dbUrl)

connect.then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.log("Could not connect to the database, reason =", err);
})


app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/v1/auth", authRoute);
app.use("/v1/shop", shopRoute);

app.listen(port, function() {
    console.log("Listening on port", port);
})