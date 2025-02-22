import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, serverTimestamp, ref, storage, uploadBytes, getDownloadURL } from "../firebase";
import Img from '../assets/imgs/logos/03_cutler.jpg';
import ModalContacto from '../components/ModalContacto';

const Contacto = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [userType, setUserType] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [userTypeError, setUserTypeError] = useState('');
  const [fileTypeError, setFileTypeError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    
    if (!validateFileType(droppedFile)) {
      setFileTypeError('Por favor, cargue un archivo de tipo PDF, DOCX, JPG, JPEG o PNG.');
    } else {
      setCertificateFile(droppedFile);
      setFileTypeError('');
    }
  };

  useEffect(() => {
    if (certificateFile) {
      setFileTypeError('');
    }
  }, [certificateFile]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    if (name.trim() === '') {
      setNameError('Ingrese su nombre.');
      hasError = true;
    } else {
      setNameError('');
    }

    if (email.trim() === '') {
      setEmailError('Ingrese su correo.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Por favor, ingrese una dirección de correo electrónico válida.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (comment.trim() === '') {
      setCommentError('Ingrese su comentario.');
      hasError = true;
    } else {
      setCommentError('');
    }

    if (!userType) {
      setUserTypeError('Seleccione un tipo de usuario.');
      hasError = true;
    } else {
      setUserTypeError('');
    }

    if (userType === 'profesor' && !certificateFile) {
      setUserTypeError('Ingrese su certificado de profesor.');
      hasError = true;
    }

    if (hasError) return;

    try {
      let certificateUrl = '';

      if (certificateFile) {
        const storageRef = ref(storage, `certificados/${certificateFile.name}`);
        await uploadBytes(storageRef, certificateFile);

        certificateUrl = await getDownloadURL(storageRef);
      }

      const formData = { name, email, comment, userType, timestamp: serverTimestamp(), certificateUrl: certificateUrl, };

      await addDoc(collection(db, "contacto"), formData);
      
      setIsSuccess(true);
      setShowModal(true);
      setName('');
      setEmail('');
      setComment('');
      setUserType('');
      setCertificateFile(null);
    } catch (error) {
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateFileType = (file) => {
    const acceptedTypes = ['application/pdf', 'application/msword', 'image/jpeg', 'image/png'];
    return acceptedTypes.includes(file.type);
  };

  return (
    <section id="contacto">
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className='flex flex-col lg:flex-row'>
          <div className='w-full lg:w-1/2'>
            <img src={Img} alt="LEVRONE entrenando" className="w-full m-auto p-8 img-size" style={{ borderRadius: '80px' }} />
          </div>

          <div className='w-full lg:w-1/2 flex items-center'>
            <form className="w-full p-8 lg:pt-8 pt-0 mx-auto" onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-800 text-md sm:text-lg font-bold mb-2">Nombre</label>
                <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingrese su nombre' className="appearance-none bg-gray-200 border border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:border-orange-600" style={{ borderWidth: '3px' }} />
                {nameError && <p className="text-red-500 mt-1">{nameError}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-800 text-md sm:text-lg font-bold mb-2">Correo</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Ingrese su correo' className="appearance-none bg-gray-200 border border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:border-orange-600" style={{ borderWidth: '3px' }} />
                {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-800 text-md sm:text-lg font-bold mb-2">Comentario</label>
                <textarea id="comment" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Quería contactarte para...' className="appearance-none bg-gray-200 border border-gray-200 rounded-lg w-full p-6 pt-1 pl-2 focus:outline-none focus:border-orange-600" style={{ borderWidth: '3px' }}></textarea>
                {commentError && <p className="text-red-500">{commentError}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="userType" className="block text-gray-800 text-md sm:text-lg font-bold mb-2">Tipo de Usuario</label>
                <select id="userType" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)} className="appearance-none bg-gray-200 border border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:border-orange-600" style={{ borderWidth: '3px' }}>
                  <option value="">Seleccione...</option>
                  <option value="cliente">Cliente</option>
                  <option value="mayorista">Mayorista</option>
                  <option value="profesor">Profesor</option>
                </select>
                {(userTypeError && userType === '') && <p className="text-red-500 mt-1">{userTypeError}</p>}
              </div>
              {userType === 'profesor' && ( 
                <div className="mb-4" onDrop={handleDrop}>
                  <label htmlFor="certificateFile" className="block text-gray-800 text-md sm:text-lg font-bold mb-2">Certificado de Profesor</label>
                  <input type="file" id="certificateFile" name="certificateFile" onChange={(e) => setCertificateFile(e.target.files[0])} accept=".pdf,.docx,.jpg,.jpeg,.png" className="appearance-none bg-gray-200 border border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:border-red-500" style={{ borderWidth: '3px' }} />
                  {(!certificateFile && userType === 'profesor') && <p className="text-red-500 mt-1">{userTypeError}</p>}
                  {fileTypeError && <p className="text-red-500 mt-1">{fileTypeError}</p>}
                </div>
              )}
              <div className="flex items-center justify-end">
                <button type="submit" className="bg-orange-600 hover:bg-orange-500 rounded-full text-gray-200 font-bold py-2 text-center inline-block w-28">Enviar</button>
              </div>
            </form>
          </div>
        </div>

        {showModal && <ModalContacto onClose={() => setShowModal(false)} isSuccess={isSuccess} />}
      </main>
    </section>
  );
};

export default Contacto;