const router = require("express").Router();
const Capital = require("./Schema");

router.get("/:_id", async (req, res) => {
    const { _id } = req.params;
    const capital = await Capital.findById(_id);
    res.status(200).json(capital);
});

router.put("/:_id", async (req, res) => {
    const { _id } = req.params;
    const capitalActualizado = await Capital.findByIdAndUpdate(_id, req.body, { new: true });
    res.status(201).json(capitalActualizado);
});

module.exports = router;