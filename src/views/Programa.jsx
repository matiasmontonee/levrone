import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../firebase';
import { FaClipboard } from 'react-icons/fa';

const Programa = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 34;

      setIsScrolled(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchDiscountCodes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'descuentos'));
        const codes = querySnapshot.docs.map(doc => doc.data().discountCode).filter(code => code);
        setDiscountCodes(codes);
      } catch (error) {
        setError('Error obteniendo los códigos de descuento.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountCodes();
  }, []);

  const handleCopy = (code) => {
    const textElement = document.getElementById(`code-${code}`);
    const range = document.createRange();
    range.selectNodeContents(textElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      setError('Error al copiar el texto.');
    }

    selection.removeAllRanges();
  };

  return (
    <section id='programa'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='lg:px-12 p-8 pb-6'>
          <h1 className='text-xl sm:text-2xl text-center'>¡Bienvenidos a nuestro Programa de Afiliados!</h1>
          <p className='mt-4 text-center'>Acá podrás canjear códigos para recibir descuentos en tus compras.</p>
          {loading ? (
            <p className='mt-8 text-center'>Cargando códigos de descuento...</p>
          ) : error ? (
            <p className='mt-8 text-center text-red-500'>{error}</p>
          ) : discountCodes.length > 0 ? (
            <div className='mt-8 flex flex-col items-center'>
              <h2 className='text-lg font-semibold'>Códigos de descuento disponibles:</h2>
              <ul className='list-disc list-inside mt-4 w-3/4 md:w-2/4'>
                {discountCodes.map((code, index) => (
                  <li key={index} className='text-lg font-semibold border border-gray-500 px-2 flex justify-between items-center my-3'>
                    <span id={`code-${code}`}>{code}</span>
                    <FaClipboard className={`transition-colors duration-500 ease-in-out cursor-pointer hover:text-orange-400 ${copiedCode === code ? 'text-green-500 animate-fade-out' : 'text-orange-500'}`} onClick={() => handleCopy(code)} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className='mt-8 text-center'>No hay códigos de descuento disponibles en este momento.</p>
          )}
        </div>
      </main>
    </section>
  );
};

export default Programa;