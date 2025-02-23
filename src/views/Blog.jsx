import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../firebase';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Blog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [posts, setPosts] = useState([]);
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
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'blog');
        const postsSnapshot = await getDocs(postsCollection);
        const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
        setIsLoading(false);
      } catch (error) {
        setError("No se pudieron cargar las noticias.");
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id='blog'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <div className="flex flex-wrap p-8 pb-6 details">
          <Link to="/"><FaHome className='mr-1.5 mt-0.5 text-gray-800' /></Link>
          <Link to="/blog" className='mr-1.5 text-gray-800'>/ Blog</Link>
        </div>
        
        <h1 className='text-4xl text-center mb-4 mx-4 font-bold'>¡Bienvenidos a nuestro blog!</h1>
        <p className='text-lg text-center mx-4'>Acá podrás encontrar toda la información que necesites sobre el fitness y la nutrición.</p>

        {isLoading ? (
          <p className="text-center text-xl my-8">Cargando noticias...</p>
        ) : error ? (
          <p className='text-center text-xl my-8 text-red-500'>{error}</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 pt-4 items-stretch">
            {posts.map(post => (
              <Link to={`/blog/${post.id}`} key={post.id}>
                <div key={post.id} className="bg-white p-4 rounded-lg shadow-md blog-hover flex flex-col h-full">
                  <img src={post.portada} alt={post.titulo} className="w-full h-54 sm:h-64 sm:object-cover rounded-md mb-4" />
                   <div className="flex flex-col flex-grow">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{post.titulo}</h2>
                      <h3 className="text-lg mb-2">{post.subtitulo}</h3>
                    </div>
                    <div className="mt-auto">
                      <p className="font-semibold">{post.serverTimestamp && post.serverTimestamp.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </section>
  );
};

export default Blog;