import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db, collection, getDocs, query, where, orderBy } from '../firebase';
import { FaChevronDown, FaHome, FaSearch, FaShippingFast, FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { agregarProductoAlCarrito } from '../store';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [breadcrumb, setBreadcrumb] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tipoParam = searchParams.get('tipo');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        let productosQuery = collection(db, 'productos');

        if (tipoParam) {
          productosQuery = query(productosQuery, where('tipo', 'array-contains', tipoParam));
          setBreadcrumb([tipoParam]);
        } else {
          setBreadcrumb([]);
        }

        if (orden) {
          productosQuery = query(productosQuery, orderBy('precio', orden));
        }

        const productosSnapshot = await getDocs(productosQuery);
        const productosData = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosData);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, [tipoParam, orden]);

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

  const handleFiltroChange = event => {
    setFiltro(event.target.value);
  };

  const handleBusquedaChange = event => {
    setBusqueda(event.target.value);
  };

  const handleOrdenChange = event => {
    setOrden(event.target.value);
  };

  const agregarAlCarrito = (producto, event) => {
    dispatch(agregarProductoAlCarrito(producto));
    const iconoCarrito = event.currentTarget;
    iconoCarrito.classList.add('agregado');
    setTimeout(() => {
      iconoCarrito.classList.remove('agregado');
    }, 300);
  };  
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const productosFiltrados = productos.filter(producto => {
    const nombreIncluido = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const tipoIncluido = filtro === '' || producto.tipo.includes(filtro);
    
    if (!nombreIncluido || !tipoIncluido) {
      return false;
    }
    
    return true;
  });
  
  if (filtro !== '' && orden !== '') {
    productosFiltrados.sort((a, b) => {
      if (orden === 'asc') {
        return a.precio - b.precio;
      } else {
        return b.precio - a.precio;
      }
    });
  }

  return (
    <section id='productos'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className="flex p-8 pb-0">
          <Link to="/"><FaHome className='mr-1.5 mt-0.5 text-gray-800' /></Link>
          <Link to="/productos" className='mr-1.5 text-gray-800'>/ Productos</Link>
          {breadcrumb.map((tipo, index) => (
            <p key={index} className='mr-1.5 text-gray-800'>
              <Link to={`/productos?tipo=${tipo}`} className='text-gray-800'>/ {capitalizeFirstLetter(tipo)} /</Link>
            </p>
          ))}
        </div>

        <div className="flex flex-col p-8 pt-6 pb-0 relative">
          <input type="text" className='h-10 pl-2 pr-10 mb-8 rounded-md border border-black placeholder-black' placeholder='Buscar...' value={busqueda} onChange={handleBusquedaChange} />
          <span className="absolute inset-y-0 right-12 bottom-12 flex items-center"><FaSearch /></span>

          <select className='h-10 pl-2 rounded-md border border-black appearance-none cursor-pointer' value={filtro} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            <option value="accesorio">Accesorios</option>
            <option value="suplemento">Suplementos</option>
            <option value="creatina">Creatinas</option>
            <option value="ganador">Ganadores</option>
            <option value="quemador">Quemadores</option>
            <option value="pre">Pre-entrenos</option>
            <option value="post">Post-entrenos</option>
            <option value="proteina">Proteínas</option>
            <option value="cinturon">Cinturones</option>
            <option value="muñequera">Muñequeras</option>
            <option value="rodillera">Rodilleras</option>
            <option value="venda">Vendas</option>
            <option value="shaker">Shakers</option>
          </select>
          <span className="absolute inset-y-0 right-12 bottom-2 top-28 flex items-center pointer-events-none">
            <FaChevronDown />
          </span>
        </div>

        <div className="flex flex-col p-8 pb-0 relative">
          <select className='h-10 pl-2 rounded-md border border-black appearance-none cursor-pointer' value={orden} onChange={handleOrdenChange}>
            <option value="">Ordenar</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
          <span className="absolute inset-y-0 right-12 bottom-2 top-10 flex items-center pointer-events-none">
            <FaChevronDown />
          </span>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
          {productosFiltrados.map(producto => (
            <div key={producto.id} className="h-full bg-white p-4 pb-0 border border-white rounded-lg hover:border-red-500 cursor-pointer flex flex-col justify-between">
              <Link to={`/productos/${producto.id}`}>
                <div className="relative">
                  <img src={producto.imagen} alt={producto.nombre} className="w-48 h-48 mb-2 mx-auto relative" />
                  {producto.porcentaje && (
                    <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-90 text-white rounded-xl">
                      <p className="px-2">{producto.porcentaje}% OFF</p>
                    </div>
                  )}
                  {producto.envio && (
                    <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-90 text-white rounded-xl">
                      <div className='flex items-center px-2'>
                        <FaShippingFast className='text-green-500 mb-0.5 mr-2' />
                        <p className="text-green-500 font-bold">{producto.envio}</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className='font-bold text-red-500 text-sm'>{producto.marca}</p>
                <h3 className="font-semibold mb-4">{producto.nombre}</h3>
              </Link>
              <div className='mt-auto flex justify-between items-center'>
                {producto.descuento ? (
                  <>
                    <div className='flex items-center'>
                      <p className="text-xl font-bold mr-2">${producto.precio}</p>
                      <p className="text-gray-500 line-through">${producto.descuento}</p>
                    </div>
                    <button onClick={(event) => agregarAlCarrito(producto, event)} className='text-2xl text-red-500 hover:text-red-400 carrito-icon'><FaShoppingCart /></button>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold">${producto.precio}</p>
                    <button onClick={(event) => agregarAlCarrito(producto, event)} className='text-2xl text-red-500 hover:text-red-400 carrito-icon'><FaShoppingCart /></button>
                  </>
                )}
              </div>
              <Link to={`/productos/${producto.id}`}>
                <button className='w-full bg-red-500 my-4 p-2 rounded-lg text-white hover:bg-red-400 font-semibold'>Ver detalle</button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default Productos;