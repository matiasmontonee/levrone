import React, { useState, useEffect } from 'react';
import { db, doc, getDoc } from '../firebase';
import { Link, useParams } from 'react-router-dom';
import { FaExternalLinkAlt, FaHome, FaInfoCircle, FaShippingFast } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { agregarProductoAlCarrito } from '../store';

const Detalles = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [mensajeError, setMensajeError] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [agregadoAlCarrito, setAgregadoAlCarrito] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const productoDoc = await getDoc(doc(db, 'productos', id));
        if (productoDoc.exists()) {
          const productoData = { id: productoDoc.id, ...productoDoc.data() };
          setProducto(productoData);
          setSelectedImage(productoData.imagen);
        } else {
          setError("Error al obtener el producto.");
        }
      } catch (error) {
        setError("Error al obtener el producto.");
      }
    };

    fetchProducto();
  }, [id]);

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

  const handleCodigoPostalChange = (event) => {
    setCodigoPostal(event.target.value);
  };

  const handleCalcularEnvio = () => {
    let trimmedPostalCode = codigoPostal.trim();

    if (trimmedPostalCode.length !== 4 || isNaN(trimmedPostalCode)) {
      setMensajeError('Ingrese un código postal válido de 4 números.');
      setShippingCost(0);
    } else {
      if (trimmedPostalCode.charAt(0) === '0') {
        setCodigoPostal('');
        setMensajeError('Ingrese un código postal válido de 4 números.');
        setShippingCost(0);
      } else {
        const postalCode = parseInt(trimmedPostalCode);

        if (postalCode <= 999) {
          setMensajeError('El código postal mínimo es 1000.');
          setShippingCost(0);
        } else {
          setMensajeError('');

          if (postalCode >= 1000 && postalCode <= 2000) {
            setShippingCost(10000);
          } else if (postalCode >= 2000 && postalCode <= 4000) {
            setShippingCost(12000);
          } else if (postalCode >= 4000 && postalCode <= 6000) {
            setShippingCost(14000);
          } else if (postalCode >= 6000 && postalCode <= 9999) {
            setShippingCost(16000);
          } else {
            setShippingCost(0);
          }
        }
      }
    }
  };

  const agregarAlCarrito = () => {
    dispatch(agregarProductoAlCarrito(producto));
    setAgregadoAlCarrito(true);
    setTimeout(() => {
      setAgregadoAlCarrito(false);
    }, 2000);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <section id='detalles'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className="flex flex-wrap p-8 pb-0 details">
          <Link to="/"><FaHome className='mr-1.5 mt-0.5 text-gray-800' /></Link>
          <Link to="/productos" className='mr-1.5 text-gray-800'>/ Productos /</Link>
          {producto && (
            <>
              <p className='mr-1.5 text-gray-800'>
                <Link to={`/productos?tipo=${producto.tipo[0]}`} className='text-gray-800'>{capitalizeFirstLetter(producto.tipo[0])} /</Link>
              </p>
              <p className='mr-1.5 text-gray-800'>
                <Link to={`/productos?tipo=${producto.tipo[1]}`} className='text-gray-800'>{capitalizeFirstLetter(producto.tipo[1])} /</Link>
              </p>
              <p className='text-gray-800'>{producto.nombre}</p>
            </>
          )}
        </div>

        {error ? (
          <p className="text-2xl text-center p-8 text-red-500">{error}</p>
        ) : producto ? (
          <div className='m-6'>
            <div className='flex flex-col md:flex-row justify-between'>
              <div className='border border-gray-300 rounded-lg md:w-1/2 relative'>
                <img src={selectedImage} alt={producto.nombre} className="w-96 h-96 mx-auto" />
                {producto.imagen && producto.imagen2 && (
                  <div className="flex mt-4 justify-center">
                    <img src={producto.imagen} alt={producto.nombre} className={`w-12 h-12 mx-2 cursor-pointer border ${selectedImage === producto.imagen ? 'border-orange-500' : 'border-gray-300'}`} onClick={() => setSelectedImage(producto.imagen)} />
                    <img src={producto.imagen2} alt={producto.nombre} className={`w-12 h-12 mx-2 cursor-pointer border ${selectedImage === producto.imagen2 ? 'border-orange-500' : 'border-gray-300'}`} onClick={() => setSelectedImage(producto.imagen2)} />
                  </div>
                )}
                {producto.porcentaje && (
                  <div className="absolute top-0 right-0 m-4 p-1 bg-black bg-opacity-90 text-white rounded-xl">
                    <p className="px-2">{producto.porcentaje}% OFF</p>
                  </div>
                )}
                {producto.envio && (
                  <div className="absolute top-0 right-0 m-4 p-1 bg-black bg-opacity-90 text-white rounded-xl">
                    <div className='flex items-center px-2'>
                      <FaShippingFast className='text-green-500 mb-0.5 mr-2' />
                      <p className="text-green-500 font-bold">{producto.envio}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className='md:w-1/2 mx-4 md:mx-0 md:ml-12 mt-4 md:mt-0'>
                <p className='font-bold text-xl mb-2 text-orange-600'>{producto.marca}</p>
                <p className='font-semibold text-4xl mb-4'>{producto.nombre}</p>
                <div className="flex items-center font-semibold text-4xl">
                  <p>${producto.precio.toLocaleString('es-ES')}</p>
                  {producto.descuento && (
                    <p className="font-normal text-xl ml-4 text-gray-500 line-through">${producto.descuento.toLocaleString('es-ES')}</p>
                  )}
                </div>
                <button onClick={agregarAlCarrito} className={`text-lg font-semibold text-white rounded-md p-2 my-4 bg-${agregadoAlCarrito ? 'green' : 'orange'}-500 hover:bg-${agregadoAlCarrito ? 'green' : 'orange'}-600 transition-colors duration-300`}>
                  {agregadoAlCarrito ? 'Agregado al carrito' : 'Agregar al carrito'}
                </button>
                {producto.sabor && (
                  <p className='font-bold mb-4'><span>Sabor:</span> {producto.sabor}</p>
                )}
                <p className='font-bold mb-2'>Calcular envío <span className='text-sm text-gray-700 font-normal'>(si el total de la compra es mayor a $100.000, el envío es gratis)</span></p>
                <div className='flex items-center mb-2'>
                  <input type="number" value={codigoPostal} onChange={handleCodigoPostalChange} className='rounded-md border border-gray-400 h-10 w-48 p-2' placeholder='Código postal' />
                  <button onClick={handleCalcularEnvio} className='rounded-md p-2 ml-4 bg-orange-600 hover:bg-orange-500 text-white font-bold'>Calcular</button>
                </div>
                <p className="text-red-500 mb-1">{mensajeError}</p>
                {shippingCost > 0 && (
                  <p className="font-bold mb-2">Costo de envío: ${shippingCost}</p>
                )}
                <a href='https://www.correoargentino.com.ar/formularios/cpa' target='_blank' rel='noreferrer' className='flex w-48 text-gray-500 hover:text-blue-500 hover:cursor-pointer hover:underline'>
                  <p>No sé mi código postal</p>
                  <FaExternalLinkAlt className='ml-2 mt-0.5' />
                </a>
              </div>
            </div>
            <div className='mt-8'>
              <h3 className='text-2xl text-center mb-4 font-semibold'>Descripción del producto</h3>
              <p className='mb-8'>{producto.descripcion}</p>
              <div className='flex text-xl'>
                <h4 className='mb-4 font-semibold'>Información importante</h4>
                <FaInfoCircle className='ml-2 mt-1 text-orange-600' />
              </div>
              <p className='mb-2'><span className='font-bold'>Uso:</span> {producto.uso}</p>
              <p><span className='font-bold'>Propiedades:</span> {producto.otro}</p>
            </div>
          </div>
        ) : (
          <p className='text-2xl text-center pb-8'>Cargando producto...</p>
        )}
      </main>
    </section>
  );
};

export default Detalles;