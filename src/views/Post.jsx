import React, { useState } from 'react';
import { db, auth, addDoc, collection, serverTimestamp } from '../firebase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Post = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!title || !description) {
      setError('Ambos campos deben estar completos.');
      return;
    }

    if (user) {
      try {
        await addDoc(collection(db, 'posts'), {
          title, description, user: user.displayName, userId: user.uid, createdAt: serverTimestamp(),
        });
        navigate('/foro');
      } catch (error) {
        setError('Error al agregar post.');
      }
    }
  };

  return (
    <section id='post'>
      <h1 className='text-3xl sm:text-4xl text-center my-4 mx-4 font-bold'>Agregar un nuevo post</h1>
      <form onSubmit={handleSubmit} className='flex flex-col mx-auto w-3/4 md:w-2/4'>
        {error && <p className='text-red-500 mb-2 text-center sm:text-lg'>{error}</p>}
        <label>Título</label>
        <input type='text' placeholder='¿Cómo ganar masa muscular?' value={title} onChange={(e) => setTitle(e.target.value)} className='my-2 p-2 border border-gray-400 rounded w-full' />
        <label>Descripción</label>
        <textarea placeholder='Necesito consejos para aumentar de peso, hace semanas que no veo resultados.' value={description} onChange={(e) => setDescription(e.target.value)} className='my-2 p-2 border border-gray-400 rounded w-full' />
        <div className="flex mt-2">
          <button type='submit' className='mr-2 rounded-md bg-orange-600 p-2 text-white hover:bg-orange-500 font-semibold'>Publicar</button>
          <Link to='/foro'>
            <button className='rounded-md bg-gray-500 p-2 text-white hover:bg-gray-400 font-semibold'>Cancelar</button>
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Post;