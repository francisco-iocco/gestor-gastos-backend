const mongoose = require("mongoose");
const { Schema } = mongoose;

const capitalSchema = new Schema({
    monto: Number,
});

const capitalModel = mongoose.model("capitales", capitalSchema);

module.exports = capitalModel;