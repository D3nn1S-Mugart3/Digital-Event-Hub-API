const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

/**
 * @openapi
 * /api/user/:
 *   get:
 *     description: Obtiene todos los usuarios.
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   usuario_id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "John"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 */
router.get("/", userController.getAllUsers);

/**
 * @openapi
 * /api/user/forgot-password:
 *   post:
 *     description: Envia un correo electrónico para restablecer la contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Email sent.
 *       400:
 *         description: Email es requerido.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/forgot-password", userController.forgotPassword);

/**
 * @openapi
 * /api/user/reset-password/{token}:
 *   post:
 *     description: Restablece la contraseña del usuario.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "someResetToken"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password has been reset successfully.
 *       400:
 *         description: Token y nueva contraseña requeridos.
 *       500:
 *         description: Error resetting password.
 */
router.post("/reset-password/:token", userController.resetPassword);

/**
 * @openapi
 * /api/user/reset-password/{token}:
 *   get:
 *     description: Muestra el formulario para restablecer la contraseña.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "someResetToken"
 *     responses:
 *       200:
 *         description: Formulario para restablecer la contraseña.
 */
router.get("/reset-password/:token", userController.getResetPasswordForm);

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     description: Elimina un usuario por ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", userController.deleteUser);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     description: Actualiza un usuario por ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "John"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               contrasena:
 *                 type: string
 *                 example: "newPassword123"
 *               telefono:
 *                 type: string
 *                 example: "1234567890"
 *               rol_id:
 *                 type: integer
 *                 example: 1
 *               membresia_id:
 *                 type: integer
 *                 example: 1
 *               activo:
 *                 type: boolean
 *                 example: true
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               fotoPerfil:
 *                 type: string
 *                 example: "profile.jpg"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al actualizar el usuario.
 */
router.put("/:id", userController.updateUser);

/**
 * @openapi
 * /api/users/doc:
 *   get:
 *     description: Sirve la documentación HTML.
 *     responses:
 *       200:
 *         description: HTML file served.
 *       404:
 *         description: File not found.
 */
router.get("/doc", userController.getDoc);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     description: Obtiene un usuario por ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalles del usuario.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", userController.getUserById);

module.exports = router;
