import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector  } from 'react-redux';
import { eliminarProductoDelCarrito, vaciarCarrito } from '../store';
import { FaTimes, FaHome, FaUser, FaDumbbell, FaPhoneAlt, FaBars, FaShoppingCart, FaShippingFast, FaQuestionCircle, FaTrash, FaArrowRight } from 'react-icons/fa';
import Logo from '../assets/imgs/logos/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const carrito = useSelector(state => state.carrito);

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
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const removeFromCart = (id) => {
    dispatch(eliminarProductoDelCarrito(id));
  };

  return (
  <header>
    <div className="bg-gray-200 text-center py-2">
      <p className="text-sm text-gray-700">¡Calidad garantizada en todos los productos!</p>
    </div>

    <nav className={`bg-black p-2 flex justify-between items-center fixed w-full z-40 ${isScrolled ? 'top-0 left-0 right-0' : 'sticky'}`}>
      {/* DESKTOP */}

      {/* LOGO */}
      <div className="flex items-center hidden lg:flex">
        <a href="/">
          <img src={Logo} alt="Logo de Levrone" className="py-1 h-16 ml-2 logo" />
        </a>
      </div>
      {/* OPCIONES */}
      <div className="hidden lg:flex items-center">
        <Link to={`/`} className="nav-link text-lg text-white mr-4">Inicio</Link> 
        <Link to={`/quienes-somos`} className="nav-link text-lg text-white mr-4">Quiénes somos</Link> 
        <Link to={`/productos`} className="nav-link text-lg text-white mr-4">Productos</Link> 
        <Link to={`/envios`} className="nav-link text-lg text-white mr-4">Envíos</Link> 
        <Link to={`/contacto`} className="nav-link text-lg text-white mr-4">Contacto</Link> 
      </div>
      {/* CARRITO Y LOGIN*/}
      <div className="hidden lg:flex items-center text-white" ref={cartRef}>
        <button onClick={toggleCart}><FaShoppingCart className='w-8 h-8 logo mr-3'/></button>
        <Link to={`/login`}><FaUser className='w-7 h-7 logo mr-3'/></Link>
      </div>

      {/* MOBILE */}

      {/* HAMBURGUESA */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="text-white z-50 logo">
          <FaBars className='w-8 h-8 mt-1.5 ml-3' />
        </button>
      </div>

      {/* LOGO */}
      <div className="lg:hidden">
        <a href="/">
          <img src={Logo} alt="Logo de Levrone" className="py-1 h-12 logo" />
        </a>
      </div>
      
      {/* CARRITO */}
      <div className='lg:hidden'> 
        <button onClick={toggleCart} className="text-white z-50 logo">
          <FaShoppingCart className='w-8 h-8 mt-1.5 mr-3' />
        </button>
      </div>

      {/* DETALLES DEL MENU HAMBURGUESA */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleMenu}></div>
      )}
      <div ref={menuRef} className={`lg:hidden fixed inset-0 bg-black z-50 transform transition-transform ease-in-out duration-500 w-3/4 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-start p-4 pt-0">
          <div className="flex justify-between items-center w-full">
            <p className='text-lg text-white p-4 pt-6 pb-6 pl-0'>Menú</p>
            <span className='text-white text-lg mt-1 cursor-pointer logo' onClick={toggleMenu}><FaTimes /></span>
          </div>
          <Link to={`/`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
            <FaHome className="inline-block mr-2 mb-1.5" />Inicio
          </Link>
          <Link to={`/quienes-somos`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
            <FaQuestionCircle className="inline-block mr-2 mb-1" />Quiénes somos
          </Link>
          <Link to={`/productos`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
            <FaDumbbell className="inline-block mr-2 mb-1" />Productos
          </Link>
          <Link to={`/envios`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
            <FaShippingFast className="inline-block mr-2 mb-1" />Envíos
          </Link>
          <Link to={`/contacto`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
            <FaPhoneAlt className="inline-block mr-2 mb-1.5" />Contacto
          </Link>
          <Link to={`/login`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
            <FaUser className="inline-block mr-2 mb-1.5" />Login
          </Link>
        </div>
      </div>

      {/* DETALLES DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleCart}></div>
      )}
      <div ref={cartRef} className={`overflow-y-auto fixed top-0 right-0 bottom-0 bg-black z-50 transform transition-transform ease-in-out duration-500 w-3/4 lg:w-2/4 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-start p-4 pt-0">
          <div className="flex justify-between items-center w-full">
            <p className='text-lg text-white p-4 py-6 pl-0'>Carrito</p>
            <span className='text-white text-lg mt-1 cursor-pointer logo' onClick={toggleCart}><FaTimes /></span>
          </div>
          {carrito.length === 0 ? (
            <>
              <div className='text-center w-full mt-8'>
                <p className="text-white text-lg sm:text-xl mb-8">Tu carrito está vacío :(</p>
                <Link to="/productos" className='border text-white hover:bg-gray-700 p-1.5 lg:p-2.5 pr-2 lg:pr-4 pl-2 lg:pl-4 rounded-full' onClick={toggleCart}><button>Ver productos</button></Link>
              </div>
            </>
          ) : (
            carrito.map((producto, index) => (
              <div key={index} className='flex border-b-2 w-full mb-4 pb-2 text-white mt-1'>
                <img src={producto.imagen} alt={producto.nombre} className="w-32 h-32" />
                <div className="flex flex-col ml-4 w-full">
                  <div className='flex justify-between mb-1'>
                    <p className='text-red-500 uppercase'>{producto.marca}</p>
                    <button onClick={() => removeFromCart(producto.id)} className='hover:text-red-500 '><FaTrash /></button>
                  </div>
                  <p className='mb-1'>{producto.nombre}</p>
                  <p className='mb-1'>${producto.precio}</p>
                </div>
              </div>
            ))
          )}
          {carrito.length !== 0 && (
            <>
              <div className='flex flex-col sm:flex-row justify-between items-center mt-2 mb-6 w-full'>
                <Link to="/productos" className='border text-white hover:bg-gray-700 p-2 px-4 rounded-full sm:mb-0 mb-4' onClick={toggleCart}><button>Ver más productos</button></Link>
                <button onClick={() => dispatch(vaciarCarrito())} className='border text-white hover:bg-gray-700 p-2 px-4 rounded-full'>Vaciar carrito</button>
              </div>
              <Link to="/checkout" className='w-full flex justify-center items-center border text-white bg-red-500 hover:bg-red-400 p-2 px-4 rounded-full' onClick={toggleCart}><button>Continuar con la compra</button><FaArrowRight className='ml-2 mt-0.5' /></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  </header>
  );
};

export default Navbar;