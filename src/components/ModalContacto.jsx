import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ModalContacto = ({ onClose, isSuccess }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-80 flex justify-center items-center">
      <div className={`bg-white border-2 ${isSuccess ? 'border-green-500' : 'border-red-500'} rounded-lg overflow-hidden p-8 pt-4 pr-6 max-w-lg w-full mx-4`}>
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 focus:outline-none">
            <FaTimes className="h-6 w-6 sm:h-8 sm:w-8 text-white bg-red-500 hover:bg-red-400 rounded-full p-1"/>
          </button>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold pr-6 mb-4 mt-4">{isSuccess ? 'Formulario enviado con éxito' : 'Formulario enviado sin éxito'}</h2>
        <p className="text-md sm:text-lg pr-8 text-gray-600">{isSuccess ? 'Gracias por contactarnos, te responderemos lo antes posible.' : 'Ups! Algo salió mal. Por favor, intentalo de nuevo.'}</p>
      </div>
    </div>
  );
};

export default ModalContacto;