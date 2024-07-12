const express = require("express");
const cors = require("cors");
const { swaggerDocs: V1SwaggerDocs } = require("./src/swaggers");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const subirImagen = require("./routes/imagenRoutes"); // Corrige la ruta relativa
const authMiddleware = require("./middleware/authMiddleware");
const sequelize = require("./config/db");
const ENV = require("./src/config/config");

const app = express();
const PORT = ENV.port || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//teos
app.use("/api", require("./src/api_routes"));

//rutas - irvings
app.use("/api/imagenes", subirImagen); // Utiliza imagenesRouter para las rutas de imágeness
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/events", eventRoutes);

// Ruta protegida por middleware de autenticación
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.userRole}` });
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      V1SwaggerDocs(app, PORT);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
