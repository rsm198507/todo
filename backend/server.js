const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

const Task = require("./tasks");
const User = require("./users");

mongoose.set('useFindAndModify', false);

const API_PORT = 3001;
const app = express();

const jwt = require('jsonwebtoken');

const config = require('./config');
const sha256 = require('js-sha256');

const VerifyToken = require('./VerifyToken');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PATCH, PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
});

const router = express.Router();

const dbRoute = "mongodb+srv://rudenko-serg:!index111@cluster0-mhk9d.mongodb.net/test?retryWrites=true";

mongoose.connect(
    dbRoute,
    {useNewUrlParser: true}
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));


router.post("/tasks", VerifyToken, (req, res) => {
    Task.find({userID: req.userId}, (err, data) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    });
});


router.patch("/data", VerifyToken, async (req, res) => {
    const {text, checked} = req.body;

    try {
        const task = await Task.findById({_id: req.body._id});
        task.text = text;
        task.checked = checked;
        await task.save();
        res.json({success: true});
    } catch (err) {
        console.log(err);
    }
});

router.delete("/data", VerifyToken, (req, res) => {
    Task.deleteOne({_id: req.body.id}, err => {
        if (err) return res.send(err);
        return res.json({success: true});
    });
});

router.post("/data", VerifyToken, (req, res) => {
    let task = new Task();
    const {text, checked} = req.body;
    if (!text) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }
    task.text = text;
    task.checked = checked;
    task.userID = req.userId;
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
            if (data) return res.json({success: false, error: "Already exists."})
        });
        if (findUser === null) {
            User.create({
                    name: name,
                    mail: mail,
                    password: sha256(password)
                },
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem registering the user`.");
                    let token = jwt.sign({id: user._id}, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.status(200).send({auth: true, token: token}); //res.token
                });
        }

    } catch (e) {
        console.log(e);
    }
});

router.post("/signin", async (req, res) => {
    const {mail} = req.body;
    try {
        await User.findOne({mail: mail}, (err, data) => {
            if (err) return res.status(500).send('Error on the server.');
            if (!data) return res.status(404).send('No user found.');

            const token = jwt.sign({id: data._id}, config.secret, {
                expiresIn: 86400
            });
            res.status(200).send({auth: true, token: token, data: data});
        });

    } catch (e) {
        res.status(500).send('Internal server error');
        console.log(e);
    }
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
