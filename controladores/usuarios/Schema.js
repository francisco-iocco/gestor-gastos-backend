const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarioSchema = new Schema({
    email: String,
    contrasena: String,
    capital: {
        type: "ObjectId",
        ref: "capitales"
    },
    ingreso: {
        type: "ObjectId",
        ref: "ingreso-mes"
    },
    gastos: [Object]
});

const usuarioModel = mongoose.model("usuarios", usuarioSchema);

module.exports = usuarioModel;