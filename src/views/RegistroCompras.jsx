import React, { useEffect, useState } from 'react';
import { db, collection, query, where, getDocs } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const RegistroCompras = () => {
  const [compras, setCompras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 34;

      setIsScrolled(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCompras = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const comprasQuery = query(collection(db, 'ordenes'), where('formData.email', '==', user.email));

      try {
        const querySnapshot = await getDocs(comprasQuery);
        const comprasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCompras(comprasData);
      } catch (error) {
        setError('Error al obtener las compras.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompras();
  }, [user]);

  const getEstadoCompra = (timestamp) => {
    const currentTime = new Date();
    const purchaseTime = timestamp.toDate();
    const timeDifference = currentTime - purchaseTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference < 24 ? (
      <span className='text-orange-500 font-semibold'>En proceso</span>
    ) : (
      <span className='text-green-500 font-semibold'>Entregado</span>
    );
  };

  return (
    <section id='registro-compras'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='p-8 sm:px-16 shadow-lg rounded-lg'>
          <h1 className="text-2xl font-bold text-center mb-8">Historial de Compras</h1>

          {isLoading ? (
            <p className="text-center text-xl my-8">Cargando productos...</p>
          ) : error ? (
            <p className="text-center text-xl my-8 text-red-500">{error}</p>
          ) : compras.length === 0 ? (
            <p className="text-center text-lg my-8">No has realizado ninguna compra.</p>
          ) : (
            compras.map(compra => (
              <div key={compra.id} className="border-b-2 mb-8 pb-4">
                <p className='text-lg font-bold'>Pedido #{compra.id}</p>
                <p className='text-lg font-bold'>Envío: ${compra.shippingCost.toLocaleString('es-ES')}</p>
                {compra.discountAmount > 0 && (
                  <p className='text-lg font-bold'>Descuento: ${compra.discountAmount.toLocaleString('es-ES')}</p>
                )}
                <p className='text-lg font-bold'>Total: ${compra.totalConEnvio.toLocaleString('es-ES')}</p>
                <p className="text-gray-600 my-2">
                  {new Date(compra.timestamp.toDate()).toLocaleString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})} - {getEstadoCompra(compra.timestamp)}
                </p>
                <div>
                  {compra.carrito.map((producto, index) => (
                    <div key={index} className="flex items-center sm:flex-row flex-col mb-4">
                      <img src={producto.imagen} alt={producto.nombre} className="w-32 h-32 rounded-md mr-4" />
                      <div>
                        <p className="font-semibold">{producto.nombre}</p>
                        <p className="text-gray-600">Cantidad: {producto.cantidad}</p>
                        <p className="font-bold">${producto.precioTotal.toLocaleString('es-ES')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </section>
  );
};

export default RegistroCompras;