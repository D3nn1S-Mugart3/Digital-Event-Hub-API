const cloudinary = require('cloudinary').v2;
const User = require('../models/userModel');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imagenController = {
  subirImagen: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }

      // Subir imagen a Cloudinary
      const resultado = await cloudinary.uploader.upload(req.file.path);

      // Actualizar la URL de la imagen en la base de datos
      const [updatedRows] = await User.update(
        { foto_perfil: resultado.secure_url },
        { where: { usuario_id: req.params.usuarioId } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ foto_perfil: resultado.secure_url });
    } catch (error) {
      console.error('Error en subirImagen:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = imagenController;
