import React, { useState, useEffect } from 'react';

const ConfirmacionView = () => {
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

  return (
    <section id='confirmacion'>
      <main className={`${isScrolled ? 'lg:mt-20 mt-16' : ''}`}>
        <p>Confirmado</p>
      </main>
    </section>
  );
};

export default ConfirmacionView;