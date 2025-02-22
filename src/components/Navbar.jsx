import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector  } from 'react-redux';
import { eliminarProductoDelCarrito, vaciarCarrito, incrementarCantidadProducto, decrementarCantidadProducto } from '../store';
import { FaTimes, FaHome, FaUser, FaDumbbell, FaPhoneAlt, FaBars, FaShoppingCart, FaShippingFast, FaQuestionCircle, FaTrash, FaArrowRight, FaShoppingBag, FaNewspaper, FaPlus, FaMinus, FaComments, FaTrophy, FaUserPlus } from 'react-icons/fa';
import Logo from '../assets/imgs/logos/logo.png';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const carrito = useSelector(state => state.carrito);
  const totalProductosEnCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  const precioTotalCarrito = useSelector(state => state.precioTotalCarrito);
  const isSubtotalCalculated = precioTotalCarrito !== undefined;
  const { isAuthenticated, user, logout } = useAuth();

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
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
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

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const removeFromCart = (id) => {
    dispatch(eliminarProductoDelCarrito(id));
  };

  const incrementQuantity = (id) => {
    dispatch(incrementarCantidadProducto(id));
  };

  const decrementQuantity = (id) => {
    dispatch(decrementarCantidadProducto(id));
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
          <img src={Logo} alt="Logo de LEVRONE" className="h-16 ml-2 logo" />
        </a>
      </div>
      {/* OPCIONES */}
      <div className="hidden lg:flex items-center">
        <Link to={`/`} className="nav-link text-lg text-white mr-4">Inicio</Link> 
        <Link to={`/quienes-somos`} className="nav-link text-lg text-white mr-4">Quiénes somos</Link> 
        <Link to={`/productos`} className="nav-link text-lg text-white mr-4">Productos</Link> 
        <Link to={`/envios`} className="nav-link text-lg text-white mr-4">Envíos</Link> 
        <Link to={`/contacto`} className="nav-link text-lg text-white mr-4">Contacto</Link> 
        {isAuthenticated && <Link to={`/blog`} className="nav-link text-lg text-white mr-4">Blog</Link>}
        {isAuthenticated && <Link to={`/foro`} className="nav-link text-lg text-white mr-4">Foro</Link>}
      </div>
      {/* CARRITO Y LOGIN*/}
      <div className="hidden lg:flex items-center text-white relative" ref={cartRef}>
        <button onClick={toggleCart} className='relative'>
          <FaShoppingCart className='mb-1.5 w-8 h-8 logo mr-3'/>
          {totalProductosEnCarrito > 0 && (
            <span className='bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center absolute -top-2 right-0 text-xs'>{totalProductosEnCarrito}</span>
          )}
          {totalProductosEnCarrito === 0 && (
            <span className='bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center absolute -top-2 right-0 text-xs'>{totalProductosEnCarrito}</span>
          )}
        </button>
        <div className="relative" ref={userDropdownRef}>
          <button onClick={toggleUserDropdown}><FaUser className='w-7 h-7 logo mr-3' /></button>
          {isUserDropdownOpen && (
            <div className={`absolute right-0 mt-2 ${isAuthenticated ? 'w-96' : 'w-32'} bg-white border rounded-md shadow-lg`}>
              {isAuthenticated ? ( // Si el usuario está autenticado 
                <>
                  <Link to="/perfil" className="block px-4 py-2 text-black hover:bg-gray-200" onClick={toggleUserDropdown}>Mi perfil</Link>
                  <Link to="/compras" className="block px-4 py-2 text-black hover:bg-gray-200" onClick={toggleUserDropdown}>Mis compras</Link>
                  <Link to="/programa" className="block px-4 py-2 text-black hover:bg-gray-200" onClick={toggleUserDropdown}>Programa de afiliados</Link>
                  <button onClick={logout} className="block px-4 py-2 text-black hover:bg-gray-200">Cerrar sesión ({user.email})</button>
                </>
              ) : ( // Si no lo está
                <>
                  <Link to="/login" className="block px-4 py-2 text-black hover:bg-gray-200" onClick={toggleUserDropdown}>Iniciar sesión</Link>
                  <Link to="/registro" className="block px-4 py-2 text-black hover:bg-gray-200" onClick={toggleUserDropdown}>Registrarse</Link>
                </>
              )}
            </div>
          )}
        </div>
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
          <img src={Logo} alt="Logo de LEVRONE" className="py- h-14 logo" />
        </a>
      </div>

      {/* CARRITO */}
      <div className='lg:hidden items-center text-white relative'> 
        <button onClick={toggleCart} className="text-white z-50 logo relative">
          <FaShoppingCart className='w-8 h-8 mt-1.5 mr-3' />
          {totalProductosEnCarrito > 0 && (
            <span className='bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center absolute -top-1 right-0 text-xs'>{totalProductosEnCarrito}</span>
          )}
          {totalProductosEnCarrito === 0 && (
            <span className='bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center absolute -top-1 right-0 text-xs'>{totalProductosEnCarrito}</span>
          )}
        </button>
      </div>

      {/* DETALLES DEL MENU HAMBURGUESA */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleMenu}></div>
      )}
      <div ref={menuRef} className={`lg:hidden fixed inset-0 bg-black z-50 transform transition-transform ease-in-out duration-500 w-full overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-start p-4 pt-0">
          <div className="flex justify-between items-center w-full">
            <p className='text-lg text-white p-4 pt-6 pb-6 pl-0'>Menú</p>
            <span className='text-white text-lg mt-1 cursor-pointer hover:text-red-500' onClick={toggleMenu}><FaTimes /></span>
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
          {isAuthenticated ? ( // Si el usuario está autenticado
            <>
              <Link to={`/blog`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
                <FaNewspaper className="inline-block mr-2 mb-1" />Blog
              </Link>
              <Link to={`/foro`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
                <FaComments className="inline-block mr-2 mb-1" />Foro
              </Link>
              <Link to={`/compras`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
                <FaShoppingBag className="inline-block mr-2 mb-1.5" />Mis compras
              </Link>
              <Link to={`/programa`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
                <FaTrophy className="inline-block mr-2 mb-1.5" />Programa de afiliados
              </Link>
              <button onClick={logout} className="nav-link text-lg text-white text-left border-b border-white p-6 pl-0 w-full">
                <FaUser className="inline-block mr-2 mb-1.5 text-left" />Cerrar Sesión ({user.email})
              </button>
            </>
          ) : ( // Si no lo está
            <>
              <Link to={`/login`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
                <FaUser className="inline-block mr-2 mb-1.5" />Iniciar Sesión
              </Link>
              <Link to={`/registro`} className="nav-link text-lg text-white border-b border-white p-6 pl-0 w-full" onClick={toggleMenu}>
                <FaUserPlus className="inline-block mr-2 mb-1.5" />Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      {/* DETALLES DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleCart}></div>
      )}
      <div ref={cartRef} className={`overflow-y-auto fixed top-0 right-0 bottom-0 bg-white z-50 transform transition-transform ease-in-out duration-500 w-full lg:w-2/4 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-start p-4 pt-0">
          <div className="flex justify-between items-center w-full text-lg">
            <p className='p-4 py-6 pl-0'>Carrito</p>
            <span className='mt-1 cursor-pointer hover:text-red-500' onClick={toggleCart}><FaTimes /></span>
          </div>
          {carrito.length === 0 ? (
            <>
              <div className='text-center w-full mt-8'>
                <p className="text-lg sm:text-xl mb-8">Tu carrito está vacío :(</p>
                <Link to="/productos" className='text-white bg-orange-600 hover:bg-orange-500 p-2.5 px-4 rounded-full' onClick={toggleCart}><button>Ver productos</button></Link>
              </div>
            </>
          ) : (
            carrito.map((producto, index) => (
              <div key={index} className='flex border-b-2 border-gray-300 w-full mb-4 pb-2 mt-1'>
                <img src={producto.imagen} alt={producto.nombre} className="w-32 h-32" />
                <div className="flex flex-col ml-4 w-full">
                  <div className='flex justify-between mb-1'>
                    <p className='text-orange-600 font-bold uppercase'>{producto.marca}</p>
                    <button onClick={() => removeFromCart(producto.id)} className='hover:text-red-500 '><FaTrash /></button>
                  </div>
                  <p className='mb-1'>{producto.nombre}</p>
                  <p className='mb-1 font-bold'>${producto.precioTotal.toLocaleString('es-ES')}</p>
                  <div className='flex items-center'>
                    <button onClick={() => decrementQuantity(producto.id)} className='hover:text-orange-600'><FaMinus /></button>
                    <p className='mx-2 font-semibold'>{producto.cantidad}</p>
                    <button onClick={() => incrementQuantity(producto.id)} className='hover:text-orange-600'><FaPlus /></button>
                  </div>
                </div>
              </div>
            ))
          )}
          {carrito.length !== 0 && (
            <>
              <div className='flex flex-col sm:flex-row justify-between items-center mt-2 mb-4 sm:mb-6 w-full text-white'>
                <Link to="/productos" className='bg-gray-500 hover:bg-gray-600 p-2 px-4 rounded-full sm:mb-0 mb-4' onClick={toggleCart}><button>Ver más productos</button></Link>
                <p className='hidden sm:block text-black font-bold'>
                  {precioTotalCarrito !== undefined
                    ? `Subtotal: $${precioTotalCarrito.toLocaleString('es-ES')}`
                    : 'Subtotal: Calculando...'}
                </p>
                <button onClick={() => dispatch(vaciarCarrito())} className='bg-gray-500 hover:bg-gray-600 p-2 px-4 rounded-full'>Vaciar carrito</button>
              </div>
              <p className='sm:hidden text-black font-bold mb-4 mx-auto'>
                {precioTotalCarrito !== undefined
                  ? `Subtotal: $${precioTotalCarrito.toLocaleString('es-ES')}`
                  : 'Subtotal: Calculando...'}
              </p>
              <Link to="/checkout" className={`w-full flex justify-center items-center text-white font-bold p-2 px-4 rounded-full ${!isSubtotalCalculated ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500'}`} onClick={isSubtotalCalculated ? toggleCart : (e) => e.preventDefault()}>
                Continuar con la compra
                <FaArrowRight className='ml-2' />
              </Link>
              {!isSubtotalCalculated && (
                <p className="text-red-500 mx-auto mt-2">Debe actualizar el precio antes de comprar.</p>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  </header>
  );
};

export default Navbar;