import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../assets/imgs/logos/logo.png';

const Error404 = () => {
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
    <section id='error404'>
      <main className={`flex flex-col items-center mt-4 mb-8 ${isScrolled ? 'lg:mt-24 mt-20' : ''}`}>
        <img src={bannerImage} alt="Logo de Levrone" className='w-1/4 h-1/4' />
        <div className="text-center mt-4 px-4">
          <h2 className="md:text-4xl text-xl font-bold text-red-500 mb-4">Página no encontrada</h2>
          <p className="mb-6 md:text-lg text-sm">Para ver nuestros productos {' '}
            <Link to="/productos" className="text-blue-500 underline">Clickeá acá!</Link>
          </p>
          <p>
            <Link to="/" className='text-gray-200 bg-red-600 hover:bg-red-400 md:px-4 md:py-3 px-3 py-1.5 rounded-full'>Volver a la home</Link>
          </p>
        </div>
      </main>
    </section>
  );
};

export default Error404;