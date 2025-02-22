import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs } from '../firebase';
import { FaEye } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { agregarProductoAlCarrito } from '../store';
import Banner from '../assets/imgs/banners/01_banner.png';
import Banner2 from '../assets/imgs/banners/02_banner.png';
import Banner3 from '../assets/imgs/banners/03_banner.jpg';
import Banner4 from '../assets/imgs/banners/05_banner.jpg';
import Banner5 from '../assets/imgs/banners/04_banner.png';
import Banner6 from '../assets/imgs/banners/06_banner.jpg';
import Banner7 from '../assets/imgs/banners/07_banner.png';
import Banner8 from '../assets/imgs/banners/08_banner.jpg';
import Icon1 from '../assets/imgs/iconos/01_icono.jpg';
import Icon2 from '../assets/imgs/iconos/02_icono.jpg';
import Icon3 from '../assets/imgs/iconos/03_icono.jpg';

const Inicio = () => {
  const images = [Banner, Banner2, Banner3, Banner4, Banner5];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [productosAgregados, setProductosAgregados] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosCollection = collection(db, 'productos');
        const productosSnapshot = await getDocs(productosCollection);
        const productosData = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const indicesEspecificos = [1, 5, 9, 11, 15, 42];
        const productosEspecificos = indicesEspecificos.map(index => productosData[index]);
        setProductos(productosEspecificos);
        setIsLoading(false);
      } catch (error) {
        setError("Error al obtener los productos.");
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, []);

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

  const agregarAlCarrito = (producto) => {
    dispatch(agregarProductoAlCarrito(producto));
    setProductosAgregados(prevState => ({
      ...prevState,
      [producto.id]: true,
    }));
    setTimeout(() => {
      setProductosAgregados(prevState => ({
        ...prevState,
        [producto.id]: false,
      }));
    }, 2000);
  };

  const nextSlide = () => {
    setCurrentImageIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentImageIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <section id='inicio'>
      <main className={`${isScrolled ? 'bg-gray-50 lg:mt-20 mt-16' : ''}`}>
        <div className="w-full relative">
          <div className="overflow-hidden"> {/* CAROUSEL */}
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {images.map((image, index) => (
                <div key={index} className="relative flex-shrink-0 w-full">
                  <img src={image} alt={`Slide ${index}`} className="w-full h-48 sm:h-72 md:h-96" />
                  {index === 0 && (
                    <Link to={'/productos?tipo=suplemento'}>
                      <button className="btn-banner absolute bottom-4 sm:bottom-10 left-12 sm:left-24 lg:left-56 w-34 text-red-500 hover:text-white bg-white hover:bg-red-400 py-1 sm:py-2 px-2 sm:px-4 rounded-full focus:outline-none z-10 font-bold">Ver suplementos</button>
                    </Link>
                    )}
                  {index === 1 && (
                    <Link to={'/productos?tipo=shaker'}>
                      <button className="btn-banner absolute bottom-7 sm:bottom-10 left-0 right-0 mx-auto w-32 text-gray-200 bg-blue-500 hover:bg-blue-400 py-1 sm:py-2 px-2 sm:px-4 rounded-full focus:outline-none z-10 font-bold">Ver shakers</button>
                    </Link>
                  )}
                  {index === 2 && (
                    <Link to={'/productos?tipo=suplemento'}>
                      <button className="btn-banner absolute bottom-6 sm:bottom-10 md:bottom-20 left-14 sm:left-20 lg:left-48 w-34 text-gray-200 bg-red-600 hover:bg-red-400 py-1 sm:py-2 px-2 sm:px-4 rounded-full focus:outline-none z-10 font-bold">Ver suplementos</button>
                    </Link>
                  )}
                  {index === 3 && (
                    <Link to={'/productos?tipo=suplemento'}>
                      <button className="btn-banner absolute bottom-24 sm:bottom-32 md:bottom-40 left-0 right-0 mx-auto h-7 sm:h-10 w-32 sm:w-40 text-gray-100 bg-blue-500 hover:bg-blue-400 py-1 sm:py-2 px-2 rounded-full focus:outline-none z-10 font-bold">Ver suplementos</button>
                    </Link>
                  )}
                  {index === 4 && (
                    <Link to={'/productos?tipo=muñequera'}>
                      <button className="btn-banner absolute bottom-4 sm:bottom-10 left-0 right-0 mx-auto h-7 sm:h-10 w-32 sm:w-40 text-white bg-red-600 hover:bg-red-400 py-1 sm:py-2 px-2 rounded-full focus:outline-none z-10 font-bold">Ver muñequeras</button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 -mt-8 left-4 right-4 flex">
            <button onClick={prevSlide} className="bg-gray-300 hover:bg-gray-400 text-xl text-gray-700 p-2 sm:p-4 rounded-sm mr-auto focus:outline-none">&#10094;</button>
            <button onClick={nextSlide} className="bg-gray-300 hover:bg-gray-400 text-xl text-gray-700 p-2 sm:p-4 rounded-sm ml-auto focus:outline-none">&#10095;</button>
          </div>
        </div>

        {/* PRODUCTOS */}
        <h1 className='mt-8 text-center text-2xl sm:text-3xl'>Productos con descuento</h1>

        {isLoading ? (
          <p className="text-center text-xl my-8">Cargando productos...</p>
        ) : error ? (
          <p className="text-center text-xl my-8 text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-8">
            {productos.map(producto => (
              <div key={producto?.id} className="w-80 mx-auto mb-8">
                <div className="h-full border border-white hover:border-orange-600 rounded-lg overflow-hidden bg-white flex flex-col justify-between">
                  <Link to={`/productos/${producto?.id}`} className="flex flex-col h-full">
                    <div className="relative">
                      <img src={producto?.imagen} alt={producto?.nombre} className="w-full h-64" />
                      <div className="absolute top-0 left-0 m-2 p-1 sm:p-2 bg-black bg-opacity-90 text-white rounded-xl">
                        <p className="text-center px-2">{producto?.porcentaje}% OFF</p>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <p className="text-sm text-orange-600 font-semibold">{producto?.marca}</p>
                    <div className='flex flex-col justify-between flex-grow'>
                      <p className="font-semibold">{producto?.nombre}</p>
                      <p className='text-gray-500 line-through mt-4'>${producto?.descuento.toLocaleString('es-ES')}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className="text-xl font-semibold">${producto?.precio.toLocaleString('es-ES')}</p>
                      <Link to={`/productos/${producto?.id}`}>
                        <button className='text-2xl text-orange-600 hover:text-orange-500'><FaEye /></button>
                      </Link>
                    </div>
                  </div>
                  <button className={`mt-4 py-2 px-4 text-white font-bold rounded-md transition-colors duration-300 ${productosAgregados[producto.id] ? 'bg-green-500 hover:bg-green-400' : 'bg-orange-600 hover:bg-orange-500'}`} onClick={(event) => agregarAlCarrito(producto, event)}>
                    {productosAgregados[producto.id] ? 'Agregado al carrito' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='flex justify-center mb-8'>
          <Link to={"/productos"} className="border font-bold text-gray-100 bg-orange-600 hover:bg-orange-500 md:px-8 px-4 md:py-3 py-2 rounded-full">Ver todos los productos</Link>
        </div>

        {/* BANNERS */}
        <div className='px-4 sm:px-12'>
          <Link to={'/contacto'}>
            <div className="relative banner">
              <img src={Banner6} alt="Descuento a profesores" className="w-full h-48 sm:h-56 mb-8 rounded-xl"/>
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-70 rounded-xl">
                <div className="text-white text-center">
                  <p className='text-2xl sm:text-4xl p-4'>Si sos profe, ¡consultá por descuentos exclusivos!</p>
                  <p className='text-md sm:text-xl text-gray-300 px-4'>Enviános tu certificado y te reintegramos parte de tu dinero.</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to={'/envios'}>
            <div className="relative banner">
              <img src={Banner7} alt="Envíos gratis" className="w-full h-48 sm:h-56 mb-8 rounded-xl" />
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-70 rounded-xl">
                <div className="text-white text-center">
                  <p className='text-2xl sm:text-4xl p-4'>¡Envíos gratis en compras superiores a $100.000!</p>
                  <p className='text-md sm:text-xl text-gray-300 px-4'>Aplica para todos los productos disponibles.</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to={'/productos'}>
            <div className="relative banner">
              <img src={Banner8} alt="Materias primas" className="w-full h-48 sm:h-56 mb-8 rounded-xl" />
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-70 rounded-xl">
                <div className="text-white text-center">
                  <p className='text-2xl sm:text-4xl p-4'>¡Materias primas importadas de primer nivel!</p>
                  <p className='text-md sm:text-xl text-gray-300 px-4'>Calidad garantizada en todos nuestros productos.</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <div className="sm:mb-8 bg-white border-r border-gray-300">
            <img src={Icon1} alt="Medios de pago" className="w-48 h-32 mx-auto" />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">Medios de pago</h3>
              <p className="text-gray-800">Podés pagar con tarjeta de débito o crédito de forma segura. También tenés la opción de pagar con Mercado Pago.</p>
            </div>
          </div>
          <div className="sm:mb-8 bg-white">
            <img src={Icon2} alt="Envíos Nacionales" className="w-48 h-32 mx-auto" />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">Envíos Nacionales</h3>
              <p className="text-gray-800">¡Ofrecemos envíos a toda la República Argentina! Tú paquete llega sin nigún inconveniente hasta tu domicilio.</p>
            </div>
          </div>
          <div className="mb-8 bg-white border-l border-gray-300">
            <img src={Icon3} alt="Compra protegida" className="w-48 h-32 mx-auto" />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">Compra protegida</h3>
              <p className="text-gray-800">Tu compra está segura, podés realizarla con total tranquilidad, te lo garantizamos. ¡Lo que comprás es lo que llega!</p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Inicio;