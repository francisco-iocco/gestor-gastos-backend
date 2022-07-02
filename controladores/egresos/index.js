const router = require("express").Router();
const Usuario = require("../usuarios/Schema");
const Capital = require("../capitales/Schema");
const Ingreso = require("../ingresos/Schema");

router.get("/:tipoEgreso", async (req, res) => {
    const { tipoEgreso } = req.params;
    const NuevoModel = require("./Schema")(tipoEgreso);
    const egresos = await NuevoModel.find();
    res.status(200).json(egresos);
});

router.post("/:tipoEgreso", async (req, res) => {
    const { tipoEgreso } = req.params;
    const { body } = req;

    const NuevoModel = require("./Schema")(tipoEgreso);
    const nuevoEgreso = await NuevoModel.create({
        clasificacion: body.clasificacion,
        definicion: body.definicion,
        egreso: body.egreso
    });
    nuevoEgreso.save();

    const usuario = await Usuario.findById(body.usuario).populate("capital").populate("ingreso");
    const { gastos: gastosDesactualizados, capital: { _id: capital_id, monto: montoDesactualizado }, ingreso: { _id: ingreso_id, comparacionSueldoMes: comparacionSueldoMesDesactualizado } } = usuario;
    
    const gastosActualizados = [...gastosDesactualizados];
    gastosActualizados.push(nuevoEgreso);
    await Usuario.findByIdAndUpdate(body.usuario, {gastos: gastosActualizados });

    const montoActualizado = montoDesactualizado - nuevoEgreso.egreso;
    await Capital.findByIdAndUpdate(capital_id, { monto: montoActualizado });

    const comparacionSueldoMesActualizado = comparacionSueldoMesDesactualizado - nuevoEgreso.egreso;
    await Ingreso.findByIdAndUpdate(ingreso_id, { comparacionSueldoMes: comparacionSueldoMesActualizado });

    res.status(200).json(nuevoEgreso);
});

router.put("/:tipoEgreso/:_id", async (req, res) => {
    const { tipoEgreso, _id } = req.params;
    const NuevoModel = require("./Schema")(tipoEgreso);
    const nuevoModel = await NuevoModel.findByIdAndUpdate(_id, req.body, { new: true });
    res.status(200).json(nuevoModel);
});

router.delete("/:tipoEgreso/:_id", async (req, res) => {
    try {
        const { tipoEgreso, _id } = req.params;
        const { usuario_id } = req.query;
        const NuevoModel = require("./Schema")(tipoEgreso);
        const egresoEliminado = await NuevoModel.findByIdAndDelete(_id);
        if(!egresoEliminado) {
            res.status(404).json({
                error: "El egreso no se puede eliminar ya que no existe..."
            });
        };
        const usuario = await Usuario.findById(usuario_id);
        const { monto: montoDesactualizado } = await Capital.findById(usuario.capital);
        const { comparacionSueldoMes: comparacionSueldoMesDesactualizado } = await Ingreso.findById(usuario.ingreso);

        const gastosActualizados = usuario.gastos.filter((gasto) => {
            if(gasto._id != _id) {
                return gasto;
            };
            gastoEliminado = gasto.egreso;
        });

        await Usuario.findByIdAndUpdate(usuario_id, { gastos: gastosActualizados }, {new: true});

        const montoActualizado = montoDesactualizado + gastoEliminado;
        console.log(gastoEliminado);
        await Capital.findByIdAndUpdate(usuario.capital, { monto: montoActualizado });

        const comparacionSueldoMesActualizado = comparacionSueldoMesDesactualizado + gastoEliminado;
        await Ingreso.findByIdAndUpdate(usuario.ingreso, { comparacionSueldoMes: comparacionSueldoMesActualizado });
        
        res.status(204).send();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "El egreso no se pudo eliminar correctamente. Por favor, intentelo de nuevo..."
        });
    };
});

// router.delete("/:tipoEgreso", async (req, res) => {
//     try {
//         const { tipoEgreso, _id } = req.params;
//         const NuevoModel = require("./Schema")(tipoEgreso);
//         await NuevoModel.deleteMany();
//         res.status(204).send();
//     } catch (BSONTypeError) {
//         res.status(500).json({
//             error: "El usuario no se pudo eliminar correctamente. Por favor, intentelo de nuevo..."
//         });
//     };
// });

module.exports = router;