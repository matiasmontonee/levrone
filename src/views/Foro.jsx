import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaComment } from 'react-icons/fa';
import { db, collection, getDocs, query, orderBy, addDoc, serverTimestamp } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const Foro = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentVisible, setCommentVisible] = useState({});
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const postsWithComments = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const postId = doc.id;
          const commentsQuery = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'desc'));
          const commentsSnapshot = await getDocs(commentsQuery);
          const comments = commentsSnapshot.docs.map(commentDoc => ({ id: commentDoc.id, ...commentDoc.data() }));
          
          return { id: postId, ...doc.data(), comments };
        }));

        setPosts(postsWithComments);
      } catch (error) {
        setError('Error al cargar el foro.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCommentClick = (postId) => {
    setCommentVisible(prevState => ({ ...prevState, [postId]: !prevState[postId] }));
  };

  const handleCommentSubmit = async (postId) => {
    if (user && comment) {
      try {
        await addDoc(collection(db, 'posts', postId, 'comments'), {
          comment, user: user.displayName, userId: user.uid, createdAt: serverTimestamp(),
        });
        setComment('');
        setCommentVisible(prevState => ({ ...prevState, [postId]: false }));

        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId ? { ...post, comments: [...post.comments, { comment, user: user.displayName, createdAt: { seconds: Math.floor(Date.now() / 1000) } }] } : post 
        ));
      } catch (error) {
        setError('Error al agregar comentario.');
      }
    }
  };

  return (
    <section id='foro'>
      <main>
        <h1 className='text-3xl sm:text-4xl text-center my-4 mx-4 font-bold'>¡Bienvenidos a nuestro foro!</h1>
        <p className='sm:text-lg text-center mx-4'>Acá podrás encontrar y compartir toda la información que necesites sobre el fitness y la nutrición.</p>
  
        <div className='flex justify-center mt-4'>
          <Link to='/post'>
            <button className='rounded-md bg-orange-600 p-2 text-white hover:bg-orange-500 font-semibold mr-2'>Agregar un post</button>
          </Link>
          <Link to='/'>
            <button className='rounded-md bg-gray-500 p-2 text-white hover:bg-gray-400 font-semibold'>Volver</button>
          </Link>
        </div>
  
        {error && (
          <p className="text-2xl text-center p-8 text-red-500">{error}</p>
        )}
  
        {loading ? (
          <p className='text-lg text-center mt-6 mx-4'>Cargando posts...</p>
        ) : posts.length === 0 ? (
          <p className='text-lg text-center mt-6 mx-4'>No hay posts disponibles en este momento, ¡Sé el primero en crear uno!</p>
        ) : (
          <div className='mt-6 px-4'>
            {posts.map(post => (
              <div key={post.id} className='border border-gray-400 rounded p-4 my-4'>
                <p className='text-sm mb-2'>{post.user}</p>
                <h2 className='text-xl sm:text-2xl mb-2 font-bold'>{post.title}</h2>
                <p className='sm:text-lg'>{post.description}</p>
                <div className='flex justify-between items-center mt-2'>
                  <button className='flex items-center rounded-md bg-orange-500 p-1 px-2 text-white hover:bg-orange-400 font-semibold' onClick={() => handleCommentClick(post.id)}>Comentar   <FaComment className='ml-1' /></button>
                  <p className='text-gray-500'>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
                </div>
                {commentVisible[post.id] && (
                  <div className='mt-2'>
                    <textarea className='w-full p-2 border border-gray-400 rounded' rows='3' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Escribe tu comentario...' />
                    <button className='mt-2 rounded-md bg-green-500 p-2 text-white hover:bg-green-400 font-semibold' onClick={() => handleCommentSubmit(post.id)}>Publicar</button>
                    <button className='mt-2 ml-2 rounded-md bg-gray-500 p-2 text-white hover:bg-gray-400 font-semibold' onClick={() => handleCommentClick(post.id)}>Cancelar</button>
                  </div>
                )}
                {post.comments.length > 0 && (
                  <div className='mt-4'>
                    {post.comments.map(comment => (
                      <div key={comment.id} className='mt-2 border border-gray-400 rounded p-2'>
                        <div className="flex justify-between items-center">
                          <p className='text-sm mb-2'>{comment.user}</p>
                          <p className='text-gray-500 text-sm'>{new Date(comment.createdAt.seconds * 1000).toLocaleString()}</p>
                        </div>
                        <p className='sm:text-lg'>{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </section>
  );  
};

export default Foro;