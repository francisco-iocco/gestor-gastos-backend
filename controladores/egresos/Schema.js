const mongoose = require("mongoose");
const { Schema } = mongoose;

const nuevaColeccionSchema = new Schema({
    clasificacion: String,
    definicion: String,
    egreso: Number,
});

module.exports = function nuevoSchema(coleccion) {
    const nuevaColeccionModel = mongoose.model(coleccion, nuevaColeccionSchema);
    return nuevaColeccionModel;
};