import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../firebase';
import { FaEdit } from 'react-icons/fa';

const Perfil = () => {
  const user  = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

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

  const handleBlur = async () => {
    if (displayName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    try {
      await updateProfile(user, { displayName });
      setError('');
    } catch (error) {
      setError('Error al actualizar el perfil.');
    }
  };

  const creationTime = user.metadata.creationTime;
  const lastSignInTime = user.metadata.lastSignInTime;

  return (
    <section id='perfil'>
      <div className={`${isScrolled ? 'lg:mt-24 mt-20' : ''}`}>
        <h1 className='text-3xl sm:text-4xl text-center my-4 mx-4 font-bold'>Perfil de Usuario</h1>
        <div className='flex flex-col mx-auto w-3/4 md:w-2/4 mb-4'>
          <div className='relative my-2 p-2 border border-gray-400 rounded w-full flex items-center'>
            <label className='mr-1'>Nombre:</label>
            <input type='text' value={displayName} onChange={(e) => setDisplayName(e.target.value)} onBlur={handleBlur} className='w-full border-none outline-none' maxLength={20} />
            <FaEdit className='ml-2 text-gray-500' />
          </div>
          {error && <p className='text-red-500 mb-2'>{error}</p>}
          <p className='my-2 p-2 border border-gray-400 rounded w-full'>Email: {user.email}</p>
          <p className='my-2 p-2 border border-gray-400 rounded w-full'>ID: {user.uid}</p>
          <p className='my-2 p-2 border border-gray-400 rounded w-full'>Fecha de registro: {new Date(creationTime).toLocaleDateString()}</p>
          <p className='my-2 p-2 border border-gray-400 rounded w-full'>Último inicio de sesión: {new Date(lastSignInTime).toLocaleDateString()}</p>
        </div>
      </div>
    </section>
  );
};

export default Perfil;