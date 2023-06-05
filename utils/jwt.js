const jwt = require('jsonwebtoken')
require("dotenv/config")

const sign = (payload) => jwt.sign(payload, "secret", {expiresIn: "24h"}); 
const verify = (payload) => jwt.verify(payload, "secret"); 

module.exports = {
    sign,
    verify
}