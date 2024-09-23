const mercadopago = require('mercadopago');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": process.env.FIREBASE_TYPE,
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_AUTH_URI,
      "token_uri": process.env.FIREBASE_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
    }),
  });
}

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

module.exports = async (req, res) => { // endpoint para procesar pagos
  try {
    const { body } = req;

    // Log para ver el cuerpo de la solicitud
    console.log('Body de la solicitud:', body);

    // Ejemplo de creación de preferencia de pago
    const preference = {
      items: [
        {
          title: body.title,
          unit_price: body.price,
          quantity: body.quantity,
        },
      ],
      back_urls: {
        success: "https://tu-sitio.com/success",
        failure: "https://tu-sitio.com/failure",
        pending: "https://tu-sitio.com/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    // Devuelve la URL de pago al frontend
    res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('Error al crear la preferencia de pago:', error);
    res.status(500).send('Error al crear la preferencia de pago');
  }
};