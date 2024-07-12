const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Carpeta en Cloudinary donde se guardarán las imágenes
    format: async (req, file) => 'jpg', // Puedes cambiar el formato según sea necesario
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
