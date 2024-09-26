const mercadopago = require('mercadopago');
const express = require('express');
const cors = require('cors');

// Inicializar express
const app = express();
app.use(cors());
app.use(express.json());

// Configurar Mercado Pago con tu access token
mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN);

// Ruta para crear preferencia de pago
app.post('/api/crear-preferencia', async (req, res) => {
  const { carrito, comprador } = req.body;

  const items = carrito.map(producto => ({
    title: producto.nombre,
    unit_price: producto.precio,
    quantity: producto.cantidad
  }));

  const preference = {
    items,
    payer: {
      name: comprador.nombre,
      surname: comprador.apellido,
      email: comprador.email,
      phone: {
        area_code: comprador.telefono.slice(0, 3), // Código de área
        number: comprador.telefono.slice(3) // Número
      }
    },
    back_urls: {
      success: 'https://levrone.vercel.app/success',
      failure: 'https://levrone.vercel.app/failure',
      pending: 'https://levrone.vercel.app/pending'
    },
    auto_return: 'approved',
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });  // Enviar la preferencia al frontend
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

// Exportamos express como el handler para Vercel
module.exports = app;