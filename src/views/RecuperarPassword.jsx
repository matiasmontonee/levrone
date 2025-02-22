import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "../firebase";
import Logo from '../assets/imgs/logos/logo.png';

const RecuperarPassword = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  const handleSendResetEmail = async () => {
    setEmailError('');
    setMessage('');

    if (!email) {
      setEmailError('Ingrese un correo electrónico.');
      return;
    } else if (!isValidEmail(email)) {
      setEmailError('Ingrese un correo electrónico válido.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Correo de restablecimiento de contraseña enviado. Por favor revise su correo electrónico.');
      setTimeout(redirectToLogin, 5000);
    } catch (error) {
      setEmailError('Error al enviar el correo de restablecimiento de contraseña. Por favor, intentalo nuevamente.');
    }
  };

  return (
    <section id='recuperar-password'>
      <img src={Logo} alt="Logo de LEVRONE" className="h-32 w-32 m-auto mt-8" />

      <main className="flex justify-center items-center mt-6">
        <div className="border shadow-xl rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-3/4 lg:w-1/3">
          <h2 className="text-2xl mb-4 text-center">Recuperar contraseña</h2>
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}
          <p className='mb-4 text-sm text-center'>Ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña.</p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo Electrónico</label>
            <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError && 'border-red-500'}`} id="email" type="email" placeholder="juan@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div>
            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline" type="button" onClick={handleSendResetEmail}>Enviar correo</button>
            <p className="text-sm mt-2 text-center"><Link to={`/login`} className='text-orange-600 hover:text-orange-500 hover:underline'>Volver al inicio</Link></p>
          </div>
        </div>
      </main>
    </section>
  );
};

export default RecuperarPassword;