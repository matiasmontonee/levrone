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
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className="py-8">
          <img src={bannerImage} alt="Logo de LEVRONE" className='w-40 h-40 mx-auto' />
          <div className="text-center mt-4 px-4">
            <h2 className="md:text-4xl text-xl font-bold text-orange-600 mb-4">Página no encontrada</h2>
            <p className="mb-6 md:text-lg text-sm">Para ver nuestros productos <Link to="/productos" className="text-blue-500 hover:text-blue-400 underline">Clickeá acá!</Link></p>
            <p><Link to="/" className='text-white bg-orange-600 hover:bg-orange-500 md:px-4 md:py-3 px-3 py-1.5 rounded-full'>Volver a la home</Link></p>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Error404;