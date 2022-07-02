const usuarioRouter = require("./usuarios");
const capitalRouter = require("./capitales");
const egresoRouter = require("./egresos");
const ingresoRouter = require("./ingresos");

const enrutador = (app) => {
    app.use("/usuarios", usuarioRouter);
    app.use("/capitales", capitalRouter);
    app.use("/egresos", egresoRouter);
    app.use("/ingresos", ingresoRouter);
};

module.exports = enrutador;