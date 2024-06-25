import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <section id='footer'>
      <main className='bg-black text-white'>
        <div className='flex flex-col sm:flex-row justify-between p-8 lg:p-14'>
          <div className='sm:w-1/3 px-4'>
            <h3 className='md:text-xl text-lg mb-4 sm:mb-8'>Devoluciones</h3>
            <p className='text-md mb-4 sm:mb-8 text-size'>Averiguá más sobre envíos y devoluciones:</p>
            <Link to={"/envios"} className="font-bold text-gray-100 bg-orange-600 hover:bg-orange-500 px-4 md:px-6 py-1 md:py-2 rounded-full">Envíos</Link>
          </div>
          <div className='sm:w-1/3 px-4'>
            <h3 className='md:text-xl text-lg mb-4 sm:mb-8 margin-b'>Contáctanos</h3>
            <p className='text-md mb-4 sm:mb-8 text-size'>Para cualquier consulta, podés escribirnos a:</p>
            <a href="mailto:levroneinfo@gmail.com" className='hover:text-gray-300'>levroneinfo@gmail.com</a>
          </div>
          <div className='sm:w-1/3 px-4'>
            <h3 className='md:text-xl text-lg mb-4 sm:mb-8 margin-b'>Mayorista</h3>
            <p className='text-md mb-4 sm:mb-8 text-size'>Si querés equipar tu gimnasio, contáctanos:</p>
            <Link to={"/contacto"} className="font-bold text-gray-100 bg-orange-600 hover:bg-orange-500 px-4 md:px-6 py-1 md:py-2 rounded-full">Contacto</Link>
          </div>
        </div>

        <div className='flex justify-center border-t mx-12 pb-4 sm:pb-8'>
            <p className='mt-4 sm:mt-8 text-sm md:text-xl'>&copy; 2024 Levrone. Todos los derechos reservados</p>
        </div>
      </main>
    </section>
  );
};

export default Footer;