const config = require('./key');
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Task = require("./tasks");
const User = require("./users");
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');
mongoose.set('useFindAndModify', false);
const API_PORT = 3001;
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PATCH, PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
});

// app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://rudenko-serg:!index111@cluster0-mhk9d.mongodb.net/test?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
    dbRoute,
    {useNewUrlParser: true}
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));


router.post("/tasks", (req, res) => {
    Task.find({userID: req.body.userID}, (err, data) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    });
});



router.patch("/data", async (req, res) => {

    const {_id, text, checked} = req.body;

    try {
        const task = await Task.findById({_id: _id});
        task.text = text;
        task.checked = checked;
        const result = await task.save();

        res.json({success: true});
    } catch (e) {
        console.log(err);
    }


    Task.findById({_id: _id})
        .then(item => {
            item.text = text;
            item.checked = checked;
            return item.save();
        })
        .then(() => {
            res.json({success: true});
        })
        .catch(err => {
            console.log(err);
        });
});

router.delete("/data", (req, res) => {
    //console.log(req.body)
    const {id} = req.body;
    //console.log("req id= ", id);
    Task.deleteOne({_id: id}, err => {
        if (err) return res.send(err);
        return res.json({success: true});
    });
});

router.post("/data", (req, res) => {
    let task = new Task();

    const {text, checked, userID} = req.body;

    if (!text) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }
    task.text = text;
    task.checked = checked;
    task.userID = userID;
    task.save(err => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

router.post("/signup", async (req, res) => {

    try {

        let user = new User();

        const {name, mail, password} = req.body;

        if (!mail && !password) {
            return res.json({
                success: false,
                error: "INVALID INPUTS"
            });
        }

        const findUser = await User.findOne({mail: mail}, (err, data) => {
            if (err) return res.json({success: false, error: err});
            return res.json({success: true, data: data});
        });
        if (findUser === null) {
            user.name = name;
            user.mail = mail;
            user.password = sha256(password);
            user.save();
            //console.log("You can register");
        }

    } catch (e) {
        console.log(e);
    }

});

router.post("/signin", async (req, res) => {
    const {mail} = req.body;
    //console.log(req.body)
    try {
        await User.findOne({mail: mail}, (err, data) => {
            if (err) return res.json({success: false, error: err});
            return res.json({success: true, data: data});
        });
        // const user = await User.findOne({mail: mail});
        // //console.log(user)
        // if (!user) return res.status(404).send('User not found');
        // return res.json({user});
    } catch (e) {
        res.status(500).send('Internal server error');
        console.log(e);
    }
});

router.post("/getToken", (req, res) => {

});

// append /api for our http requests

app.use("/api", router);


// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
