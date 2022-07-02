const mongoose = require("mongoose");

const conexion = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://Francisco:4AK4k83oJwzF8s3o@recursos.s3n8nor.mongodb.net/Recursos?retryWrites=true&w=majority",
            {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            },
        );
        console.log("Base de Datos a disposición!");
    } catch (error) {
        console.log(error);
        console.log("Base de Datos no disponible...");
    };
};

module.exports = conexion;