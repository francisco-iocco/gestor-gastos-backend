const router = require("express").Router();
const Ingreso = require("./Schema");

router.get("/:_id", async (req, res) => {
    const { _id } = req.params;
    const ingreso = await Ingreso.findById(_id);
    res.status(200).json(ingreso);
});

router.put("/:_id", async (req, res) => {
    const { _id } = req.params;
    const { ingresoMes, comparacionSueldoMes } = req.body;
    const ingresoActualizado = await Ingreso.findByIdAndUpdate(_id, { ingresoMes, comparacionSueldoMes }, { new: true });
    res.status(204).json(ingresoActualizado);
});

module.exports = router;