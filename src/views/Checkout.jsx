import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { eliminarProductoDelCarrito, incrementarCantidadProducto, decrementarCantidadProducto, vaciarCarrito} from '../store';
import { FaArrowRight, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { db, collection, addDoc, serverTimestamp, getAuth, getDocs, doc, deleteDoc } from "../firebase";

const Checkout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [redirectToConfirmation, setRedirectToConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const carrito = useSelector(state => state.carrito);
  const precioTotalCarrito = useSelector(state => state.precioTotalCarrito);
  const [shippingCost, setShippingCost] = useState(0);
  const [inputDiscountCode, setInputDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [totalConDescuento, setTotalConDescuento] = useState(precioTotalCarrito + shippingCost);
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');
  const [discountDocId, setDiscountDocId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const removeFromCart = (id) => {
    dispatch(eliminarProductoDelCarrito(id));
  };
  const [formData, setFormData] = useState({
    nombre: '', apellido: '',  email: user ? user.email : '', telefono: '', provincia: '', localidad: '', postal: '', calle: '', calleNum: '', piso: '', tarjeta: '', numero: '', vencimiento: '', cvv: ''
  });
  const [errors, setErrors] = useState({
    nombre: '', apellido: '', email: '', telefono: '', provincia: '', localidad: '', postal: '', calle: '', calleNum: '', piso: '', tarjeta: '', numero: '', vencimiento: '', cvv: ''
  });
  const fieldLabels = {
    nombre: 'Nombre', apellido: 'Apellido', email: 'Email', telefono: 'Teléfono', provincia: 'Provincia', localidad: 'Localidad', postal: 'Código postal', calle: 'Calle', calleNum: 'Número', piso: 'Piso', tarjeta: 'Nombre en la tarjeta', numero: 'Número de la tarjeta', vencimiento: 'Fecha de vencimiento', cvv: 'CVV'
  };

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

  useEffect(() => { // Calcular el costo de envío cuando cambia el código postal
    const calcularCostoEnvio = () => {
      let nuevoCostoEnvio = 0;
      const postalCode = parseInt(formData.postal, 10);

      if (precioTotalCarrito > 100000) {
        nuevoCostoEnvio = 0;
      } else {
        if (postalCode >= 1000 && postalCode <= 2000) {
          nuevoCostoEnvio = 10000;
        } else if (postalCode >= 2000 && postalCode <= 4000) {
          nuevoCostoEnvio = 12000;
        } else if (postalCode >= 4000 && postalCode <= 6000) {
          nuevoCostoEnvio = 14000;
        } else if (postalCode >= 6000 && postalCode <= 9999) {
          nuevoCostoEnvio = 16000;
        } else {
          nuevoCostoEnvio = 0;
        }
      }

      setShippingCost(nuevoCostoEnvio);
    };

    calcularCostoEnvio();
  }, [formData.postal, precioTotalCarrito]);

  const incrementQuantity = (id) => {
    dispatch(incrementarCantidadProducto(id));
  };

  const decrementQuantity = (id) => {
    dispatch(decrementarCantidadProducto(id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'postal') {
      let postalValue = value.replace(/\D/g, '');
      if (postalValue.length > 4) {
        postalValue = postalValue.slice(0, 4);
      }

      if (postalValue.length > 0 && postalValue[0] === '0') {
        postalValue = '';
      }
      setFormData({
        ...formData,
        [name]: postalValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleVencimientoChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData({
      ...formData,
      vencimiento: value
    });
  };

  const generateDiscountCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleApplyDiscount = async (e) => {
    e.preventDefault();

    try {
      const descuentosQuery = collection(db, 'descuentos');
      const querySnapshot = await getDocs(descuentosQuery);
      const validCodes = querySnapshot.docs.map(doc => ({ // Mapear los docs con su ID y código
        id: doc.id,
        code: doc.data().discountCode
      }));

      // Buscar el código ingresado en la lista de códigos válidos
      const matchingCode = validCodes.find(codeObj => codeObj.code === inputDiscountCode);
        
      if (matchingCode) {
        const discountAmount = precioTotalCarrito * 0.05;
        const newTotal = (precioTotalCarrito - discountAmount) + shippingCost;
        setTotalConDescuento(newTotal);
        setDiscountApplied(true);
        setDiscountError('');
        setDiscountSuccess('¡Descuento aplicado correctamente!');
        
        setDiscountDocId(matchingCode.id); // Guardar ID del doc para eliminarlo después de comprar
      } else {
        setDiscountError('Código de descuento no válido.');
        setDiscountApplied(false);
        setDiscountSuccess('');
      }
    } catch (error) {
      setDiscountError('Hubo un error al aplicar el código de descuento.');
      setDiscountApplied(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    Object.keys(formData).forEach(key => {
      if (formData[key] === '' && key !== 'piso') {
        newErrors[key] = `El campo ${fieldLabels[key]} es obligatorio.`;
        hasError = true;
      } else if ((key === 'nombre' || key === 'apellido' || key === 'provincia' || key === 'localidad' || key === 'calle' || key === 'tarjeta') && formData[key].length < 2) {
        newErrors[key] = `El campo ${fieldLabels[key]} debe tener al menos 2 caracteres.`;
        hasError = true;
      } else if (key === 'postal' && formData[key].length !== 4) {
        newErrors[key] = `El campo ${fieldLabels[key]} debe tener 4 dígitos.`;
        hasError = true;
      } else if ((key === 'calleNum' || key === 'postal' || key === 'cvv') && (formData[key].length < 1 || formData[key].length > 4)) {
        newErrors[key] = `El campo ${fieldLabels[key]} debe tener entre 1 y 4 caracteres.`;
        hasError = true;
      } else if ((key === 'telefono' || key === 'numero') && (formData[key].length < 8 || formData[key].length > 18)) {
        newErrors[key] = `El campo ${fieldLabels[key]} debe tener entre 8 y 18 caracteres.`;
        hasError = true;
      } else if ((key === 'piso') && (formData[key].length > 2)) {
        newErrors[key] = `El campo ${fieldLabels[key]} debe tener máximo 2 caracteres.`;
        hasError = true;
      } else if (key === 'email') {
        const emailVerification = /\S+@\S+\.\S+/;
        if (!emailVerification.test(formData[key])) {
          newErrors[key] = `El campo ${fieldLabels[key]} debe tener un formato válido.`;
          hasError = true;
        }
      } else if (key === 'vencimiento') {
        const [month, year] = formData[key].split('/');
        if (formData[key].replace(/\D/g, '').length !== 4 || !month || !year || !(parseInt(month) >= 1 &&   parseInt(month) <= 12) || !(parseInt(year) >= 24 && parseInt(year) <= 34)) {
          newErrors[key] = `El campo ${fieldLabels[key]} debe tener un formato válido (MM/AA).`;
          hasError = true;
        }
      }
       else {
        newErrors[key] = '';
      }
    });

    setErrors(newErrors);

    if (!hasError) {
      try {
        const discountAmount = discountApplied ? precioTotalCarrito * 0.05 : 0;
        const totalConEnvio = (precioTotalCarrito - discountAmount) + shippingCost;
        const discountCode = generateDiscountCode();

        await addDoc(collection(db, "descuentos"), {
          discountCode,
          timestamp: serverTimestamp()
        });
        
        const ordenData = {
          precioTotalCarrito,
          shippingCost,
          totalConEnvio,
          discountAmount,
          carrito,
          formData,
          timestamp: serverTimestamp()
        };

        await addDoc(collection(db, "ordenes"), ordenData);

        if (discountDocId) { // Eliminar el código de descuento usado si existe
          const discountDocRef = doc(db, "descuentos", discountDocId);
          await deleteDoc(discountDocRef);
        }

        dispatch(vaciarCarrito());
        setRedirectToConfirmation(true);
      } catch (error) {
        setSubmitError('Ocurrió un error al procesar la compra. Inténtalo nuevamente.');
      }
    }
  };

  return (
    <section id='checkout'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        {carrito.length === 0 ? (
            <div className="text-center my-8 mx-4">
              <p className='mb-4'>Tu carrito está vacío. Agregá productos antes de continuar con el proceso de pago.</p>
              <Link to="/productos" className='text-white bg-orange-600 hover:bg-orange-500 p-1.5 lg:p-2.5 pr-2 lg:pr-4 pl-2 lg:pl-4 rounded-full'><button>Ver productos</button></Link>
            </div>
          ) : (
          <div className='flex lg:flex-row flex-col p-8'>
            <div className='lg:pr-4 lg:w-2/3 lg:border-r lg:border-gray-600 order-2 lg:order-1'>
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
                    <input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full'  readOnly={!!user} />
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
                    <input type='text' id='postal' name='postal' value={formData.postal} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                    {errors.postal && <p className="text-red-500 mt-1">{errors.postal}</p>}
                  </div>

                  <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                    <label htmlFor="calle" className='block mb-2 font-semibold'>Calle</label>
                    <input type='text' id='calle' name='calle' value={formData.calle} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                    {errors.calle && <p className="text-red-500 mt-1">{errors.calle}</p>}
                  </div>

                  <div className="w-full lg:w-1/2 mb-4 lg:pr-2">
                    <label htmlFor="calleNum" className='block mb-2 font-semibold'>Número</label>
                    <input type='number' id='calleNum' name='calleNum' value={formData.calleNum} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                    {errors.calleNum && <p className="text-red-500 mt-1">{errors.calleNum}</p>}
                  </div>

                  <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                    <label htmlFor="piso" className='block mb-2 font-semibold'>Piso <span className='text-gray-400'>(opcional)</span></label>
                    <input type='number' id='piso' name='piso' value={formData.piso} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                    {errors.piso && <p className="text-red-500 mt-1">{errors.piso}</p>}
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
                    <label htmlFor="vencimiento" className='block mb-2 font-semibold'>Fecha de vencimiento <span className='text-sm text-gray-400'>(MM/AA)</span></label>
                    <input type='text' id='vencimiento' name='vencimiento' value={formData.vencimiento} onChange={handleVencimientoChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                    {errors.vencimiento && <p className="text-red-500 mt-1">{errors.vencimiento}</p>}
                  </div>

                  <div className="w-full lg:w-1/2 mb-4 lg:pl-2">
                    <label htmlFor="cvv" className='block mb-2 font-semibold'>CVV</label>
                    <input type='number' id='cvv' name='cvv' value={formData.cvv} onChange={handleInputChange} className='border border-gray-300 rounded-md py-2 px-4 block w-full' />
                    {errors.cvv && <p className="text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                <button type='submit' className='flex justify-center items-center w-2/4 lg:w-1/4 mx-auto bg-orange-600 mb-4 lg:mb-0 mt-4 p-2 rounded-lg text-white hover:bg-orange-500 font-semibold'>Comprar <FaArrowRight className='ml-2' /></button>

                {submitError && <p className="text-red-500 mt-2 text-center">{submitError}</p>}
              </form>
            </div>

            <div className='lg:pl-4 lg:w-1/3 order-1 lg:order-2 lg:mb-0 mb-4'>
              <h2 className='text-xl sm:text-2xl mb-8 font-semibold border-b border-gray-500'>Resumen del pedido</h2>

              {carrito.length !== 0 && (
                <div>
                  <ul>
                    {carrito.map((producto, index) => (
                      <div key={index} className='flex border-b-2 w-full mb-4 pb-2'>
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
                            <p className='mx-2 font-bold'>{producto.cantidad}</p>
                            <button onClick={() => incrementQuantity(producto.id)} className='hover:text-orange-600'><FaPlus /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              <div className='flex justify-between font-bold'>
                <p>Subtotal</p>
                <p>${precioTotalCarrito.toLocaleString('es-ES')}</p>
              </div>
              <div className='flex justify-between font-bold'>
                <p>Envío</p>
                <p>${shippingCost.toLocaleString('es-ES')}</p>
              </div>
              <div className='flex justify-between font-bold'>
                <p>Total</p>
                <p>${(discountApplied ? totalConDescuento : precioTotalCarrito + shippingCost).toLocaleString('es-ES')}</p>
              </div>
              <div className="mt-2">
                <div className='flex items-center'>
                  <label htmlFor="discountCode" className='block font-semibold mr-1.5'>Código de descuento</label>
                  <Link to={'/programa'} className='text-sm text-blue-500 underline hover:text-blue-400'>(Encontralo acá)</Link>
                </div>
                <input type='text' id='discountCode' name='discountCode' value={inputDiscountCode} onChange={(e) => setInputDiscountCode(e.target.value)} className='border border-gray-300 rounded-md py-2 px-4 block w-full my-2' />
                {discountError && <p className="text-red-500 my-2">{discountError}</p>}
                {discountSuccess && <p className="text-green-500 my-2">{discountSuccess}</p>}
                <button onClick={handleApplyDiscount} className='flex justify-center mx-auto w-full bg-orange-600 p-2 rounded-lg text-white hover:bg-orange-500 font-semibold'>Aplicar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </section>
  );
};

export default Checkout;