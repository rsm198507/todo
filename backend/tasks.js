const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        text: String,
        checked: Boolean,
        userID: String
    }
);

module.exports = mongoose.model("Task", DataSchema);
