const express = require("express");
const router = express.Router();
const VerifyToken = require('../helpers/VerifyToken');
const Task = require("../models/tasks");
module.exports = app => {


    app.use("/api", router);
}
