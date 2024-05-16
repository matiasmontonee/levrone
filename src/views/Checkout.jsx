import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { eliminarProductoDelCarrito } from '../store';
import { FaArrowRight, FaTrash } from 'react-icons/fa';
import { db, collection, addDoc, serverTimestamp } from "../firebase";

const CheckoutView = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [redirectToConfirmation, setRedirectToConfirmation] = useState(false);
  const carrito = useSelector(state => state.carrito);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const removeFromCart = (id) => {
    dispatch(eliminarProductoDelCarrito(id));
  };
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', provincia: '', localidad: '', postal: '', calle: '', calleNum: '', piso: '', tarjeta: '', numero: '', vencimiento: '', cvv: ''
  });
  const [errors, setErrors] = useState({
    nombre: '', apellido: '', email: '', telefono: '', provincia: '', localidad: '', postal: '', calle: '', calleNum: '', tarjeta: '', numero: '', vencimiento: '', cvv: ''
  });
  const fieldLabels = {
    nombre: 'Nombre', apellido: 'Apellido', email: 'Email', telefono: 'Teléfono', provincia: 'Provincia', localidad: 'Localidad', postal: 'Código postal', calle: 'Calle', calleNum: 'Número', tarjeta: 'Nombre en la tarjeta', numero: 'Número de la tarjeta', vencimiento: 'Fecha de vencimiento', cvv: 'CVV'
  }

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
    if (redirectToConfirmation) {
      navigate('/confirmacion');
    }
  }, [redirectToConfirmation, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    Object.keys(formData).forEach(key => {
      if (formData[key] === '' && key !== 'piso') {
        newErrors[key] = `El campo ${fieldLabels[key]} es obligatorio.`;
        hasError = true;
      } else {
        newErrors[key] = '';
      }
    });

    setErrors(newErrors);

    if (!hasError && carrito.length !== 0) {
      try {
        const ordenData = {
          carrito,
          formData,
          timestamp: serverTimestamp()
        };

        await addDoc(collection(db, "ordenes"), ordenData);

        setRedirectToConfirmation(true);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    if (carrito.length === 0) {
      navigate('/productos');
    }
  }, [carrito, navigate]);

  return (
    <section id='checkout'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='flex lg:flex-row flex-col lg:px-12 px-8 lg:py-16 py-12'>
          <div className='lg:pr-4 lg:w-2/3 lg:border-r lg:border-gray-600'>
            <form onSubmit={handleSubmit} method='POST'>
              <h2 className='text-xl sm:text-2xl mb-8 font-semibold border-b border-gray-500'>Información de envío</h2>

              <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                  <label htmlFor="nombre" className='block mb-2 font-semibold'>Nombre</label>
                  <input type='text' id='nombre' name='nombre' value={formData.nombre} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.nombre && <p className="text-red-500 mt-1">{errors.nombre}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                  <label htmlFor="apellido" className='block mb-2 font-semibold'>Apellido</label>
                  <input type='text' id='apellido' name='apellido' value={formData.apellido} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.apellido && <p className="text-red-500 mt-1">{errors.apellido}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                  <label htmlFor="email" className='block mb-2 font-semibold'>Email</label>
                  <input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                  <label htmlFor="telefono" className='block mb-2 font-semibold'>Teléfono</label>
                  <input type='number' id='telefono' name='telefono' value={formData.telefono} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.telefono && <p className="text-red-500 mt-1">{errors.telefono}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                  <label htmlFor="provincia" className='block mb-2 font-semibold'>Provincia</label>
                  <input type='text' id='provincia' name='provincia' value={formData.provincia} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.provincia && <p className="text-red-500 mt-1">{errors.provincia}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                  <label htmlFor="localidad" className='block mb-2 font-semibold'>Localidad</label>
                  <input type='text' id='localidad' name='localidad' value={formData.localidad} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.localidad && <p className="text-red-500 mt-1">{errors.localidad}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                  <label htmlFor="postal" className='block mb-2 font-semibold'>Código postal</label>
                  <input type='number' id='postal' name='postal' value={formData.postal} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.postal && <p className="text-red-500 mt-1">{errors.postal}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                  <label htmlFor="calle" className='block mb-2 font-semibold'>Calle</label>
                  <input type='text' id='calle' name='calle' value={formData.calle} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.calle && <p className="text-red-500 mt-1">{errors.calle}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                  <label htmlFor="calleNum" className='block mb-2 font-semibold'>Número</label>
                  <input type='text' id='calleNum' name='calleNum' value={formData.calleNum} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.calleNum && <p className="text-red-500 mt-1">{errors.calleNum}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                  <label htmlFor="piso" className='block mb-2 font-semibold'>Piso <span className='text-gray-400'>(opcional)</span></label>
                  <input type='text' id='piso' name='piso' value={formData.piso} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                </div>
              </div>

              <h2 className='text-xl sm:text-2xl mb-8 font-semibold border-b border-gray-500'>Información de pago</h2>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                  <label htmlFor="tarjeta" className='block mb-2 font-semibold'>Nombre en la tarjeta</label>
                  <input type='text' id='tarjeta' name='tarjeta' value={formData.tarjeta} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.tarjeta && <p className="text-red-500 mt-1">{errors.tarjeta}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                  <label htmlFor="numero" className='block mb-2 font-semibold'>Número de la tarjeta</label>
                  <input type='number' id='numero' name='numero' value={formData.numero} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.numero && <p className="text-red-500 mt-1">{errors.numero}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                  <label htmlFor="vencimiento" className='block mb-2 font-semibold'>Fecha de vencimiento</label>
                  <input type='date' id='vencimiento' name='vencimiento' value={formData.vencimiento} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.vencimiento && <p className="text-red-500 mt-1">{errors.vencimiento}</p>}
                </div>

                <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                  <label htmlFor="cvv" className='block mb-2 font-semibold'>CVV</label>
                  <input type='number' id='cvv' name='cvv' value={formData.cvv} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                  {errors.cvv && <p className="text-red-500 mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <button type='submit' className='flex justify-center items-center w-1/4 mx-auto bg-red-500 mb-4 lg:mb-0 mt-4 p-2 rounded-lg text-white hover:bg-red-400 font-semibold'>Comprar <FaArrowRight className='ml-2' /></button>
            </form>
          </div>
          <div className='lg:pl-4 lg:w-1/3'>
            <h2 className='text-xl sm:text-2xl mb-8 font-semibold border-b border-gray-500'>Resumen del pedido</h2>

            {carrito.length !== 0 && (
              <div>
                <ul>
                  {carrito.map((producto, index) => (
                    <div key={index} className='flex border-b-2 w-full mb-4 pb-2'>
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
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default CheckoutView;