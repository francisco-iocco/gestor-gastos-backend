const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingresoSchema = new Schema({
    ingresoMes: Number,
    comparacionSueldoMes: Number,
    mes: String
});

module.exports = mongoose.model("ingreso-mes", ingresoSchema);