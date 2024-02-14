const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authConfig = require("./configs/auth.config");
const compression = require("compression");
const serverless = require("serverless-http");
const app = express();
const path = require("path");
app.use(compression({ threshold: 110 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

function customLogger(message) {
    if (authConfig.NODE_ENV === "production") {
        console.log(message);
    }
}

app.get("/", (req, res) => {
    res.send("Hello Survey App Project!");
});

require('./routes/userRoute')(app);
require('./routes/adminRoute')(app);
// require('./routes/partnerRoute')(app);



mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_URL, /*{ useNewUrlParser: false, useUnifiedTopology: false, }*/).then((data) => {
    customLogger(`Survey App Mongodb connected with server: ${data.connection.host}`);
});

app.listen(process.env.PORT, () => {
    customLogger(`Listening on port ${process.env.PORT}!`);
});

module.exports = { handler: serverless(app) };