const express = require('express');
const imagenController = require('../controllers/imagenController');
const router = express.Router();


// Ruta para subir una imagen y guardar la URL
// Utiliza un parámetro dinámico `perfilId` para identificar el perfil al que se asociará la imagen
router.put('/perfiles/:perfilId/subir-imagen', imagenController.subirImagen);

module.exports = router;
