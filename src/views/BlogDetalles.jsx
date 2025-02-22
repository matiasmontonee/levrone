import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc } from '../firebase';
import { FaHome } from 'react-icons/fa';

const BlogDetalles = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = doc(db, 'blog', id);
        const postSnapshot = await getDoc(postDoc);
        if (postSnapshot.exists()) {
          setPost({ id: postSnapshot.id, ...postSnapshot.data() });
        } else {
          setError("No se encontró el documento.");
        }
      } catch (error) {
        setError("Error al cargar la noticia.");
      }
    };

    fetchPost();
  }, [id]);

  return (
    <section id='blog-detalles'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className="flex flex-wrap p-8 pb-6 details">
          <Link to="/"><FaHome className='mr-1.5 mt-0.5 text-gray-800' /></Link>
          <Link to="/blog" className='mr-1.5 text-gray-800'>/ Blog /</Link>
          {post && <p className='text-gray-800'>{post.titulo}</p>}
        </div>

        <div className="p-8 pt-0">
          {error ? (
            <p className="text-2xl text-center p-8 text-red-500">{error}</p>
          ) : post ? (
            <>
              <h2 className="text-4xl font-bold mb-4">{post.titulo}</h2>
              <p className="text-xl text-gray-800 mb-2">{post.resumen}</p>
              <p className="font-semibold mb-2">{post.serverTimestamp && post.serverTimestamp.toDate().toLocaleString()}hs.</p>
              <img src={post.portada} alt={post.titulo} className="sm:w-2/4 sm:h-2/4 object-cover rounded-md mb-4" />
              <p className="text-lg text-gray-800">{post.descripcion}</p>
            </>
          ) : (
            <p className='text-2xl text-center p-8'>Cargando noticia...</p>
          )}
        </div>
      </main>
    </section>
  );
};

export default BlogDetalles;