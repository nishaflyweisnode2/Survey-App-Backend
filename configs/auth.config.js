require("dotenv").config();

module.exports = {
    secret: process.env.SECRET,
    accessTokenTime: process.env.ACCESS_TOKEN_TIME,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    NODE_ENV: process.env.NODE_ENV
};