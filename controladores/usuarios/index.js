const router = require("express").Router();
const Usuario = require("./Schema");
const Capital = require("../capitales/Schema");
const Ingreso = require("../ingresos/Schema");

function obtenerFecha() {
    const horarioUniversal = new Date()
    const horaUniversal = horarioUniversal.getHours();
    const diaUniversal = horarioUniversal.getDate();
    const horaArgentina = 3;

    if(horaUniversal >= horaArgentina) {
        horarioUniversal.setHours(horaUniversal - horaArgentina);
    } else {
        switch(horaUniversal) {
            case 0:
                horarioUniversal.setDate(diaUniversal - 1);
                horarioUniversal.setHours(21);
            case 1:
                horarioUniversal.setDate(diaUniversal - 1);
                horarioUniversal.setHours(22);
            case 2:
                horarioUniversal.setDate(diaUniversal - 1);
                horarioUniversal.setHours(23);
        };
    };

    return horarioUniversal;
}

function obtenerNombreMes(numeroMes) {
    switch(numeroMes) {
        case 0:
            return "enero";
        case 1:
            return "febrero";
        case 2:
            return "marzo";
        case 3:
            return "abril";
        case 4:
            return "mayo";
        case 5:
            return "junio";
        case 6:
            return "julio";
        case 7:
            return "agosto";
        case 8:
            return "septiembre";
        case 9:
            return "octubre";
        case 10:
            return "noviembre";
        case 11:
            return "diciembre";
    };
};

router.get("/", async (req, res) => {
    const { query } = req;
    if(Object.keys(query).length > 0) {
        const busquedaPorEmail = await Usuario.find({ email: query.email });
        const usuario = await Usuario.find(query).populate("capital");
        if(Array.isArray(busquedaPorEmail) && busquedaPorEmail.length === 0) {
            return res.status(404).json({
                emailError: "Este email no está registrado..."
            });
        };
        if(Array.isArray(usuario) && usuario.length === 0) {
            return res.status(404).json({
                contrasenaError: "Contraseña incorrecta..."
            });
        };
        return res.status(200).json(usuario);
    };
    const usuarios = await Usuario.find().populate("capital");
    res.status(200).json(usuarios);
});

router.get("/:_id", async (req, res) => {
    const { _id } = req.params;
    const usuario = await Usuario.findById(_id).populate("capital").populate("ingreso");
    
    const horarioArgentina = obtenerFecha();
    let mesActual = obtenerNombreMes(horarioArgentina.getMonth());

    if(horarioArgentina.getDate() === 1) {
        const { mes: mesAnterior, ingresoMes } = await Ingreso.findById(usuario.ingreso._id);
        if(mesAnterior != mesActual) {
            const { monto: montoDesactualizado } = await Capital.findById(usuario.capital._id);
            const montoActualizado = montoDesactualizado + ingresoMes;
            const capital = await Capital.findByIdAndUpdate(usuario.capital._id, { monto: montoActualizado });
            const ingreso = await Ingreso.findByIdAndUpdate(usuario.ingreso._id, { mes: mesActual });
            console.log({ capital, ingreso });
        };
    };

    res.status(200).json(usuario);
});

router.post("/", async (req, res) => {
    const datos = {...req.body};
    const usuarios = await Usuario.find();
    let error = false;
    usuarios.forEach((usuarioRegistrado) => {
        if(datos.email === usuarioRegistrado.email) {
            error = true;
        };
    });

    const capital = await Capital.create({});
    await capital.save();

    const horarioArgentina = obtenerFecha();
    const mes = obtenerNombreMes(horarioArgentina.getMonth());
    
    const ingreso = await Ingreso.create({ mes });
    await ingreso.save();

    const usuarioARegistrar = await Usuario.create({...req.body, capital: capital._id, ingreso: ingreso._id});
    await usuarioARegistrar.save();

    if(error) {
        return res.status(400).json({
            emailError: "Este email ya ha sido utilizado..."
        });
    } else {
        return res.status(201).json(usuarioARegistrar);
    }
});

router.put("/:_id", async (req, res) => {
    const { _id } = req.params;
    const datos = {...req.body};
    
    const usuarioDesactualizado = await Usuario.findById(_id);
    if(usuarioDesactualizado.email === datos.email) {
        return res.status(400).json({
            advertencia: "Has utlizado el mismo email de usuario!"
        });
    }

    const usuarios = await Usuario.find();
    usuarios.forEach((usuarioRegistrado) => {
        if(
            datos.contrasena === usuarioRegistrado.contrasena
        ) {
            return res.status(400).json({
                error: "La contraseña ya ha sido utilizada por otro usuario..."
            });
        };
    });

    const usuarioActualizado = await Usuario.findByIdAndUpdate(_id, datos, { new: true });
    res.status(201).json(usuarioActualizado);
});

router.delete("/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const usuarioEliminado = await Usuario.findByIdAndDelete(_id);
        if(!usuarioEliminado) {
            res.status(404).json({
                error: "El usuario no se puede eliminar ya que no existe..."
            });
        }
        res.status(204).send();
    } catch (BSONTypeError) {
        res.status(500).json({
            error: "El usuario no se pudo eliminar correctamente. Por favor, intentelo de nuevo..."
        });
    };
});

module.exports = router;