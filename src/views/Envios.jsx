import React, { useState, useEffect } from 'react';
import { BsChevronDown } from 'react-icons/bs';

const Envios = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [height, setHeight] = useState(0);

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

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    setHeight(openIndex === index ? 0 : document.getElementById(`acordeon-${index}`).scrollHeight);
  };

  return (
    <section id='envios'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='lg:px-12 p-8'>
          <h3 className='text-xl sm:text-2xl mb-8'>¿Cómo nos manejamos?</h3>
          <p className='text-gray-500 mb-8'>En LEVRONE, trabajamos con Correo Argentino, el cual facilita la entrega de productos a todo el país. Nuestro objetivo principal es que los productos lleguen en tiempo y forma a todos nuestros clientes, dejándolos así satisfechos con nuestros servicios de primera calidad. También ofrecemos una promoción, en la cual si realizas una compra mayor a $100.000, ¡el envío es totalmente gratis!</p>

          <h3 className='text-xl sm:text-2xl mb-8'>¿Cómo devuelvo un producto?</h3>
          <h4 className='text-lg sm:text-xl mb-4'>1. Pedí la devolución</h4>
          <p className='text-gray-500 mb-4'>Para devolver un producto, deberás comunicarte con nosotros vía <a href="https://wa.me/+5491133501860" target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:text-blue-500 underline'>WhatsApp</a>. Allí deberás especificar el motivo de la devolución y luego comenzaremos con el proceso de la misma.</p>

          <h4 className='text-lg sm:text-xl mb-4'>2. Devolución del producto</h4>
          <p className='text-gray-500 mb-8'>Antes de preparar el paquete, revisá que el producto esté en las mismas condiciones que lo recibiste, sin usar y con todos sus accesorios, ya que de otra forma no realizaremos la devolución de dinero. Si compraste más de una unidad y te llegó en un mismo paquete, deberás guardar todo en el mismo paquete al devolverlo. A partir de ese momento, tendrás 7 días hábiles para entregar el paquete a la sucursal de correo más cercana.</p>

          <h4 className='text-lg sm:text-xl mb-4'>3. Devolución del dinero</h4>
          <p className='text-gray-500 mb-8'>Haremos el reembolso 3 días hábiles después de que llegue el producto, una vez que revisemos si cumple con las políticas de devolución. Sin embargo, algunas veces podemos hacer el reembolso ni bien entregás el producto, para que tengas tu dinero más rápido.</p>
          
          <h3 className='text-xl sm:text-2xl mb-8'>Preguntas frecuentes</h3>
          
          <div className='border-t border-b'>
            <button className={`flex items-center justify-between w-full py-8 sm:text-lg text-gray-800 ${openIndex === 0 ? 'open' : ''}`} onClick={() => handleToggle(0)}>
              <span className='pr-4 text-left'>¿Cuándo ofrecemos envíos gratis?</span>
              <BsChevronDown className={openIndex === 0 ? 'rotate' : 'rotate'} />
            </button>
            <div style={{ height: openIndex === 0 ? height : 0, overflow: 'hidden', transition: 'height 0.3s ease' }}>
              <p className='text-gray-500 pr-10 pb-2 acordeon' id={`acordeon-0`}>El envío es gratis para compras mayores a $100.000, ya sea un solo producto o varios que superen esa cantidad.</p>
            </div>
          </div>
          <div className='border-b'>
            <button className={`flex items-center justify-between w-full py-8 sm:text-lg text-gray-800 ${openIndex === 1 ? 'open' : ''}`} onClick={() => handleToggle(1)}>
              <span className='pr-4 text-left'>¿Dónde recibo mi pedido?</span>
              <BsChevronDown className={openIndex === 1 ? 'rotate' : 'rotate'} />
            </button>
            <div style={{ height: openIndex === 1 ? height : 0, overflow: 'hidden', transition: 'height 0.3s ease' }}>
              <p className='text-gray-500 pr-10 pb-2 acordeon' id={`acordeon-1`}>Recibirás tu pedido en la dirección del domicilio que hayas seleccionado al momento de realizar la compra.</p>
            </div>
          </div>
          <div className='border-b'>
            <button className={`flex items-center justify-between w-full py-8 sm:text-lg text-gray-800 ${openIndex === 2 ? 'open' : ''}`} onClick={() => handleToggle(2)}>
              <span className='pr-4 text-left'>¿Cuánto pagaré por un envío?</span>
              <BsChevronDown className={openIndex === 2 ? 'rotate' : 'rotate'} />
            </button>
            <div style={{ height: openIndex === 2 ? height : 0, overflow: 'hidden', transition: 'height 0.3s ease' }}>
              <p className='text-gray-500 pr-10 pb-2 acordeon' id={`acordeon-2`}>El precio mínimo de envío es de $10.000, aunque dependerá de la zona en que te encuentres, podés calcularlo al momento de realizar una compra.</p>
            </div>
          </div>
          <div className='border-b'>
            <button className={`flex items-center justify-between w-full py-8 sm:text-lg text-gray-800 ${openIndex === 3 ? 'open' : ''}`} onClick={() => handleToggle(3)}>
              <span className='pr-4 text-left'>¿Cuándo me reintegran el dinero?</span>
              <BsChevronDown className={openIndex === 3 ? 'rotate' : 'rotate'} />
            </button>
            <div style={{ height: openIndex === 3 ? height : 0, overflow: 'hidden', transition: 'height 0.3s ease' }}>
              <p className='text-gray-500 pr-10 pb-2 acordeon' id={`acordeon-3`}>En caso de devolución, haremos el reembolso 3 días hábiles después de que llegue el producto, una vez que revisemos si cumple con las políticas de devolución. Sin embargo, algunas veces podemos hacer el reembolso ni bien entregás el producto, para que tengas el dinero más rápido.</p>
            </div>
          </div>
          <div className='border-b'>
            <button className={`flex items-center justify-between w-full py-8 sm:text-lg text-gray-800 ${openIndex === 4 ? 'open' : ''}`} onClick={() => handleToggle(4)}>
              <span className='pr-4 text-left'>¿Puedo cancelar un pedido?</span>
              <BsChevronDown className={openIndex === 4 ? 'rotate' : 'rotate'} />
            </button>
            <div style={{ height: openIndex === 4 ? height : 0, overflow: 'hidden', transition: 'height 0.3s ease' }}>
              <p className='text-gray-500 pr-10 pb-2 acordeon' id={`acordeon-4`}>Sí, es posible. Deberás comunicarte con nosotros vía <a href="https://wa.me/+5491133501860" target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:text-blue-500 underline'>WhatsApp</a>. Allí deberás especificar el motivo de la cancelación y luego comenzaremos con el proceso de la misma.</p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Envios;