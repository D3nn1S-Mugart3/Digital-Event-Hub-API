const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

class UserService {
  static async registerUser({ nombre, email, contrasena, rol_id, membresia_id }) {
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const newUser = await User.create({
        nombre,
        email,
        contrasena: hashedPassword,
        rol_id,
        membresia_id,
      });

      await UserService.sendConfirmationEmail({ nombre, email });

      return { message: 'Usuario registrado con éxito' };
    } catch (error) {
      throw error;
    }
  }

  static async sendConfirmationEmail({ nombre, email }) {
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
      throw error;
    }
  }
}

module.exports = UserService;
