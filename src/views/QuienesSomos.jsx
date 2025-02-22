import React, { useState, useEffect } from 'react';
import Logo from '../assets/imgs/logos/logo.png';
import Logo2 from '../assets/imgs/logos/04_isopure.png';
import Logo3 from '../assets/imgs/logos/05_star-nutrition.png';
import Logo4 from '../assets/imgs/logos/06_muscletech.png';
import Logo5 from '../assets/imgs/logos/07_bsn.png';
import Logo6 from '../assets/imgs/logos/08_optimum-nutrition.png';
import Logo7 from '../assets/imgs/logos/09_ena.png';
import Logo8 from '../assets/imgs/logos/10_balboafit.png';

const QuienesSomos = () => {
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
    <section id='quienes-somos'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='flex lg:flex-row flex-col lg:px-12 p-8'>
          <div className='lg:w-2/3'>
            <h3 className='text-2xl mb-8'>LEVRONE</h3>
            <p className='text-gray-700 mb-8'>Somos una empresa joven que tiene como objetivo brindar productos de primera calidad, es por eso que todos nuestros artículos son de empresas que fabrican con materiales importados de primer nivel.</p>
            <p className='text-gray-700 pl-8 border-l-2 lg:pr-4'>En nuestro depósito contamos con el equipamiento apropiado y las instalaciones requeridas para un correcto tratamiento de los equipos durante todo el proceso de venta, preparación y envío. <br/>
            En cuanto a lo que nuestra política de calidad respecta, somos meticulosos y exigentes con nuestros métodos de control de calidad y procedimientos de limpieza para garantizar que todos los productos no sufran ningún tipo de daño. Nuestros estándares de calidad son altos ya que nuestro fin es superar la calidad de las marcas líderes del mercado nacional contemplando el poder de compra actual de los consumidores de todo tipo de Fitness en Argentina. <br/>
            La calidad de nuestros productos está garantizada a nivel Nacional por la Administración Nacional de Medicamentos, Alimentos Y Tecnología Médica (ANMAT).</p>
          </div>

          <div className='lg:w-1/3 flex justify-center items-center mt-12 lg:mt-0'>
            <img src={Logo} alt="Logo de LEVRONE" className="h-64" />
          </div>
        </div>

        <div className='lg:px-12 px-8'>
          <h3 className='text-2xl mb-8'>¿Con quiénes trabajamos?</h3>
          <p className='text-gray-700 mb-8'>Para brindarles los mejores productos a nuestros clientes, trabajamos con marcas de primer nivel altamente reconocidas y con años de experiencia en el rubro del fitness. Es por eso que queremos presentarles a cada una de ellas, las cuales nos ofrecen su excelente equipo, y gracias a ellos, este negocio es posible.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <img src={Logo2} alt="ISOPURE" className="h-40 object-contain w-64 mx-auto" />
            <img src={Logo3} alt="Star Nutrition" className="h-40 object-contain w-64 mx-auto" />
            <img src={Logo4} alt="Muscletech" className="h-40 object-contain w-64 mx-auto" />
            <img src={Logo5} alt="BSN" className="h-40 object-contain w-64 mx-auto" />
            <img src={Logo6} alt="Optimum Nutrition" className="h-40 object-contain w-64 mx-auto" />
            <img src={Logo7} alt="ENA" className="h-40 object-contain w-64 mx-auto" />
            <img src={Logo8} alt="Balboa Fit" className="h-40 object-contain w-64 mx-auto" />
          </div>
        </div>
      </main>
    </section>
  );
};

export default QuienesSomos;