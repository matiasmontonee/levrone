import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, getDocs } from '../firebase';

const Confirmacion = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [compra, setCompra] = useState(null);
  const [noCompras, setNoCompras] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 34;

      if (scrollPosition > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const ordersQuery = query(collection(db, 'ordenes'), orderBy('timestamp', 'desc'), limit(1));
        const querySnapshot = await getDocs(ordersQuery);

        if (!querySnapshot.empty) {
          const lastOrderDoc = querySnapshot.docs[0];
          const lastOrderData = {
            id: lastOrderDoc.id,
            ...lastOrderDoc.data()
          };

          setCompra(lastOrderData);
        } else {
          setNoCompras(true);
        }
      } catch (error) {
        setError('Error al obtener la compra.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastOrder();
  }, []);

  return (
    <section id="confirmacion">
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='mx-auto p-8 w-3/4'>
          {isLoading ? (
            <div className="text-center my-8">Cargando...</div>
          ) : error ? (
            <p className="text-2xl text-center p-8 text-red-500">{error}</p>
          ) : noCompras ? (
            <div className="text-center my-8">No has realizado ninguna compra recientemente.</div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-orange-600">¡Compra confirmada!</h1>
                <p className="my-2 text-gray-700">Gracias por tu compra. Tu pedido ha sido confirmado.</p>
                <p className='font-semibold'>Envío: ${compra.shippingCost.toLocaleString('es-ES')}</p>
                {compra.discountAmount > 0 && (
                  <p className='font-semibold'>Descuento: ${compra.discountAmount.toLocaleString('es-ES')}</p>
                )}
                <p className='text-xl font-bold'>Total: ${compra.totalConEnvio.toLocaleString('es-ES')}</p>
              </div>
              <div className="mb-8 flex flex-col">
                {compra.carrito.map((producto, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center border-b-2">
                    <img src={producto.imagen} alt={producto.nombre} className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-md my-4" />
                    <div className="md:ml-8 mt-4 md:mt-0">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-800">Detalles del Producto</h2>
                      <p className="text-gray-600">{producto.nombre}</p>
                      <p className="text-gray-600">Cantidad: {producto.cantidad}</p>
                      <p className="md:mb-0 mb-4 font-bold">${producto.precioTotal.toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center md:space-x-4">
                <Link to={'/productos'}>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500 mb-4 md:mb-0">Continuar Comprando</button>
                </Link>
                <Link to={'/compras'}>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">Ver Pedido</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </section>
  );
};

export default Confirmacion;