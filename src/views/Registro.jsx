import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "../firebase";
import Logo from '../assets/imgs/logos/logo.png';
import ModalUser from '../components/ModalUser';

const Registro = () => {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^.{6,}$/;
    return passwordRegex.test(password);
  };  

  const handleRegister = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setIsSubmitting(true);

    let hasError = false;

    if (!name) {
      setNameError('Ingrese su nombre completo.');
      hasError = true;
    }

    if (!email) {
      setEmailError('Ingrese un correo electrónico.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError('Ingrese un correo electrónico válido.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Ingrese una contraseña.');
      hasError = true;
    } else if (!isValidPassword(password)) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirme su contraseña.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      hasError = true;
    }

    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setShowSuccessModal(true);

      // Guardar nombre de usuario
      await updateProfile(user, { displayName: name });

      // Cerrar sesión después de registrar usuario
      await signOut(auth);
      
      setTimeout(() => {
        redirectToLogin();
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('El correo electrónico ya está en uso.');
      } else {
        setConfirmPasswordError('Error al crear el usuario.');
      }
    }
  };

  return (
    <section id='registro'>
      <img src={Logo} alt="Logo de LEVRONE" className="h-32 w-32 m-auto mt-8" />

      <main className="flex justify-center items-center mt-6">
        <div className="border shadow-xl rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-3/4 lg:w-1/3">
          <h1 className="text-2xl mb-4 text-center">Registro</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre Completo</label>
            <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nameError && 'border-red-500'}`} id="nombre" type="text" placeholder="Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo Electrónico</label>
            <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError && 'border-red-500'}`} id="email" type="email" placeholder="juan@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña <span className='text-xs text-gray-700'>(mínimo 6 caracteres)</span></label>
            <div className="relative">
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError && 'border-red-500'}`} id="password" type={showPassword ? "text" : "password"} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="absolute top-3 right-4" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="relative">
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${confirmPasswordError && 'border-red-500'}`} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button className="absolute top-3 right-4" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
          </div>
          <div>
            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline" type="button" onClick={handleRegister}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
            <p className="text-sm mt-2 text-center">¿Ya tenés una cuenta? <Link to={`/login`} className='text-blue-500 underline hover:text-blue-400'>Iniciar sesión</Link></p>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <ModalUser onClose={() => setShowSuccessModal(false)} title="¡Registro exitoso!" message="¡Bienvenido a nuestro sitio!" />
      )}
    </section>
  );
};

export default Registro;