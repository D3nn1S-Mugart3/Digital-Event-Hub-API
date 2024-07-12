const pool = require("../config/connection");
const {
  comparePasswords,
  hashPassword,
} = require("../middleware/bcryptPassword");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ENV = require("../config/config");
const path = require("path");

const getAllUsers = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM Usuarios");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email es requerido");
  }
  try {
    const [users] = await pool.query("SELECT * FROM Usuarios WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = users[0];

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetExpire = new Date();
    resetExpire.setDate(resetExpire.getDate() + 1); // Token válido por un día
    const formattedResetExpire = resetExpire.toISOString().split("T")[0];

    const [result] = await pool.query(
      "UPDATE Usuarios SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE email = ?",
      [hashedToken, formattedResetExpire, email]
    );

    if (result.affectedRows > 0) {
      const resetUrl = `http://localhost:3000/api/v1/user/reset-password/${hashedToken}`;
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: ENV.emailUser,
          pass: ENV.emailPassword,
        },
      });

      const mailOptions = {
        from: ENV.emailUser,
        to: user.email,
        subject: "Restablecimiento de Contraseña",
        html: `
          <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el botón siguiente para establecer una nueva contraseña:</p>
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px;">Restablecer Contraseña</a>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent" });
    } else {
      res.status(500).json({ error: "Error sending reset password email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token y nueva contraseña requeridos" });
  }

  try {
    const [users] = await pool.query(
      "SELECT * FROM Usuarios WHERE resetPasswordToken = ? AND resetPasswordExpire > NOW()",
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = users[0];
    const hashedPassword = hashPassword(newPassword);

    const [result] = await pool.query(
      "UPDATE Usuarios SET contrasena = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE usuario_id = ?",
      [hashedPassword, user.usuario_id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Password has been reset successfully" });
    } else {
      res.status(500).json({ error: "Error resetting password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
};

const deleteUser = async (req, res) => {
  const usuarioId = req.params.id;
  try {
    const [result] = await pool.query(
      "DELETE FROM Usuarios WHERE usuario_id = ?",
      [usuarioId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await pool.query(
      "SELECT * FROM Usuarios WHERE usuario_id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = users[0];
    const nombre = req.body.nombre || user.nombre;
    const email = req.body.email || user.email;
    let contrasena = undefined;
    if (req.body.contrasena) {
      contrasena = hashPassword(req.body.contrasena);
    } else {
      contrasena = user.contrasena;
    }
    const telefono = req.body.telefono || user.telefono;
    const rol_id = req.body.rol_id || user.rol_id;
    const membresia_id = req.body.membresia_id || user.membresia_id;
    const activo = req.body.activo || user.activo;
    const last_name = req.body.last_name || user.last_name;
    const fotoPerfil = req.body.fotoPerfil || user.fotoPerfil;
    const values = [
      nombre,
      email,
      contrasena,
      telefono,
      rol_id,
      membresia_id,
      activo,
      last_name,
      fotoPerfil,
      id,
    ];

    const updateUserQuery =
      "UPDATE Usuarios SET nombre = ?, email = ?, contrasena = ?, telefono = ?, rol_id = ?, membresia_id = ?, activo = ?, last_name = ?, fotoPerfil = ? WHERE usuario_id = ?";

    const [result] = await pool.query(updateUserQuery, values);

    if (result.affectedRows > 0) {
      const [updatedUsers] = await pool.query(
        "SELECT * FROM Usuarios WHERE usuario_id = ?",
        [id]
      );
      const updatedUser = updatedUsers[0];

      res.status(200).json({
        message: "Usuario actualizado correctamente",
        user: updatedUser,
      });
    } else {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

const getUserById = async (req, res) => {
  const usuarioId = req.params.id;
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM Usuarios WHERE usuario_id = ?",
      [usuarioId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getResetPasswordForm = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "reset-password.html"));
};

const getDoc = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "doc.html"));
};

module.exports = {
  getAllUsers,
  forgotPassword,
  resetPassword,
  deleteUser,
  updateUser,
  getUserById,
  getResetPasswordForm,
  getDoc,
};
