import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAuth, signInWithEmailAndPassword } from "../firebase";
import Logo from '../assets/imgs/logos/logo.png';
import ModalUser from '../components/ModalUser';

const Login = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [credentialsError, setCredentialsError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromProtectedRoute) {
      setShowRedirectModal(true);

      const timer = setTimeout(() => {
        setShowRedirectModal(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const redirectToHome = () => {
    window.location.href = '/';
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setIsSubmitting(true);

    let hasError = false;
  
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
    }
  
    if (hasError) {
      setIsSubmitting(false);
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setUserName(user.displayName || '');
      
      setShowSuccessModal(true);

      setTimeout(() => {
        redirectToHome();
      }, 2000);
    } catch (error) {
      setPassword('');
      setIsSubmitting(false);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setCredentialsError('Credenciales incorrectas.');
      } else {
        setCredentialsError('Credenciales incorrectas. Por favor, intentalo nuevamente.');
      }
    }
  };

  return (
    <section id='login'>
      <Link to={'/'}><button className='m-8 py-2 px-4 bg-orange-600 hover:bg-orange-500 rounded-md text-xl text-white'><FaArrowLeft /></button></Link>
      <img src={Logo} alt="Logo de LEVRONE" className="h-32 w-32 m-auto" />

      <main className="flex justify-center items-center mt-4">
        <div className="border shadow-xl rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-3/4 lg:w-1/3">
          <h1 className="text-2xl mb-4 text-center">Iniciar Sesión</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo Electrónico</label>
            <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError && 'border-red-500'}`} id="email" type="email" placeholder="juan@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div className='mb-4'>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
            <div className="relative">
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError && 'border-red-500'}`} id="password" type={showPassword ? "text" : "password"} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="absolute top-3 right-4" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          {credentialsError && <p className="text-red-500 text-sm mb-3">{credentialsError}</p>}
          <p className="text-sm"><Link to={`/recuperarpassword`} className='text-orange-600 hover:text-orange-500 hover:underline'>¿Olvidó su contraseña?</Link></p>
          <div className='mt-2'>
          <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline" type="button" onClick={handleLogin}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
            <p className="text-sm mt-2 text-center">¿No tenés una cuenta? <Link to={`/registro`} className='text-blue-500 underline hover:text-blue-400'>Registrarse</Link></p>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <ModalUser onClose={() => setShowSuccessModal(false)} title="¡Inicio de sesión exitoso!" message={`Bienvenido de vuelta, ${userName}.`} />
      )}

      {showRedirectModal && (
        <ModalUser onClose={() => setShowRedirectModal(false)} title="¡Acceso denegado!" message="Para acceder a esta sección, debes iniciar sesión." />
      )}
    </section>
  );
};

export default Login;