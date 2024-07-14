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
const db = require("./src/config/connection");
const morgan =  require('morgan');

const app = express();
const PORT = ENV.port || 7000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.disable('x-powered-by');

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

//apis-david
app.use(require('./src/routes/route.evento'))

/**
 * @openapi
 * /pago:
 *   post:
 *     summary: Crea un PaymentIntent con Stripe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Monto del pago en centavos.
 *               currency:
 *                 type: string
 *                 description: Moneda del pago (ej. USD).
 *                 enum:
 *                   - "usd"
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve el client_secret para confirmar el pago.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación.
 *                 client_secret:
 *                   type: string
 *                   description: Clave secreta del cliente para confirmar el pago.
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error detallado.
 */
app.post("/pago", async (req, res) => {
  const { body } = req;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body?.amount,
      currency: body?.currency,
      description: "Gaming Keyboard",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });


    // Realizar la inserción en la base de datos
    const [rows, fields] = await db.execute(
      'INSERT INTO Pagos (monto, fecha, tipo_pago_id, usuario_id, evento_id) VALUES (?, CURDATE(), 1, 1, 1)',
      [body.amount]
    );

    const pagoId = rows.insertId;

    // Insertar en la tabla Pago_Tarjeta
    await db.execute(
      'INSERT INTO Pago_Tarjeta (numero_tarjeta, fecha_expiracion, cvv, pago_id) VALUES (123, CURDATE(), 123, ?)',
      [pagoId]
    );

    // Verificar el estado del paymentIntent y enviar la respuesta correspondiente
    if (paymentIntent?.status !== 'completed') {
      return res.status(200).json({
        message: "Confirma tu pago",
        paymentIntentId: paymentIntent?.id, 
        client_secret: paymentIntent?.client_secret,
        //client_secret o id
      });
    } else {
      return res.status(200).json({ message: "Pago completado" });
    }

  } catch (error) {
    console.error('Error en el método POST:', error);
    const errorMessage = error.raw?.message || error.message || "Unknown error occurred";
    return res.status(500).json({ message: errorMessage });
  }
});


/**
* @openapi
* /confirmarpago:
*   post:
*     summary: Confirma un PaymentIntent con Stripe.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               paymentIntentId:
*                 type: string
*                 description: ID del PaymentIntent generado en el endpoint /api/checkout.
*               paymentMethod:
*                 type: string
*                 description: Método de pago utilizado para confirmar el PaymentIntent.
*                 enum:
*                   - "pm_card_visa"
*     responses:
*       '200':
*         description: Respuesta exitosa. Devuelve el objeto PaymentIntent confirmado.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: string
*                   description: ID del PaymentIntent.
*                 status:
*                   type: string
*                   description: Estado del PaymentIntent después de la confirmación.
*       '500':
*         description: Error interno del servidor.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Mensaje de error detallado.
*/
app.post('/confirmarpago', async (req, res) => {
  const { paymentIntentId, paymentMethod } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      { payment_method: paymentMethod }
    );
    res.status(200).send(paymentIntent);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



/**
* @openapi
* /historialpagos:
*   get:
*     summary: Obtiene el historial de pagos
*     responses:
*       '200':
*         description: Respuesta exitosa. Devuelve un array de pagos.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   pago_id:
*                     type: integer
*                   monto:
*                     type: string
*                   fecha:
*                     type: string
*                     format: date
*                   tipo_pago_id:
*                     type: integer
*                   usuario_id:
*                     type: integer
*                   evento_id:
*                     type: integer
*                   tarjeta:
*                     type: object
*                     properties:
*                       tarjeta_id:
*                         type: integer
*                       numero_tarjeta:
*                         type: string
*                       fecha_expiracion:
*                         type: string
*                         format: date
*                       cvv:
*                         type: string
*/

app.get('/historialpagos', (req, res) => {
  db.pool.query(`
    SELECT Pagos.*, Pago_Tarjeta.numero_tarjeta, Pago_Tarjeta.fecha_expiracion, Pago_Tarjeta.cvv
    FROM Pagos
    LEFT JOIN Pago_Tarjeta ON Pagos.pago_id = Pago_Tarjeta.pago_id
  `, (err, results) => {
    if (err) {
        console.log(err);
        res.status(500).send("Error al obtener el historial");
    } else {
        res.json(results);
    }
});
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
