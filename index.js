const express = require("express");
const conexion = require("./database");
const enrutador = require("./controladores");
const app = express();

conexion();

app.set("port", process.env.PORT || 5000)

app.use(express.urlencoded());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
});

enrutador(app);

app.listen(app.get("port"), () => {
    console.log(`Servidor a disposición en el ${app.get("port")}`);
});