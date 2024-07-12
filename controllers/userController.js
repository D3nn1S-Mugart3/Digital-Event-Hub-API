const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const userController = {
  register: async (req, res) => {
    const { nombre, email, last_name, contrasena, telefono, rol_id } = req.body;

    if (!nombre || !email || !last_name || !contrasena || !telefono || !rol_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const newUser = await User.create({
        nombre,
        email,
        last_name,
        contrasena: hashedPassword,
        telefono,
        rol_id,
      });

      await userController.sendConfirmationEmail({ nombre, email });

      res.status(201).json({ message: 'User created successfully', userId: newUser.usuario_id });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  },

  sendConfirmationEmail: async ({ nombre, email }) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmación de Registro',
        text: `Hola ${nombre},\n\n¡Gracias por registrarte!\n\nSaludos,\nDigital Event Hub`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.response);
    } catch (error) {
      console.error('Error enviando el correo:', error);
    }
  },
};

module.exports = userController;
