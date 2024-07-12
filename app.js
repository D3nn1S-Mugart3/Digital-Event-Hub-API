const express = require("express");
const cors = require("cors");
const { swaggerDocs: V1SwaggerDocs } = require("./src/swaggers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", require('./src/api_routes'));

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    V1SwaggerDocs(app, PORT);
});
