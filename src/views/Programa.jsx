import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Envios = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <section id='programa'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='lg:px-12 p-8 pb-6'>
          <h1 className='text-xl sm:text-2xl text-center'>¡Bienvenidos a nuestro Programa de Afiliados!</h1>
          <p className='mt-4 text-center'>Aquí podrás canjear códigos para recibir descuentos en tus compras.</p>
          <p className='mt-8 text-center'>Todavía no tienes códigos de descuento, realizá una compra para obtener uno.</p>
          <Link to='/productos' className='flex justify-center'>
            <button className='mt-4 bg-orange-500 hover:bg-orange-400 rounded-full text-white font-bold p-1 sm:py-2 px-3 sm:px-4 text-center inline-block'>Comprar</button>
          </Link>
        </div>
      </main>
    </section>
  );
};

export default Envios;