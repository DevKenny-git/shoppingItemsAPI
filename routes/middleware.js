require("dotenv").config();
const jwt = require("jsonwebtoken");


function isUserLoggedIn(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            res.status(401).send("no authorization header");
            return;
        }
        
        console.log(authorizationHeader);

        const val = authorizationHeader.split(" ");
    
        const tokenType = val[0];
        const tokenValue = val[1];
    
        if (tokenType != "Bearer") {
            res.status(401).send("not authorized");
        }
        const decoded = jwt.verify(tokenValue, process.env.secret);
        req.decoded = decoded;
        next();
        
    } catch (err) {
        console.log(err);
    }
}



function onlyAdmin (req, res, next) {
    if (req.decoded.role == "admin") {
        next();
    } else {
        res.status(403).send("action-not-allowed");
    }
}


module.exports = {isUserLoggedIn, onlyAdmin};