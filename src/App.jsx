import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida';
import { Provider } from 'react-redux';
import store from './store';
import './assets/css/style.css';
import Navbar from './components/Navbar';
import Inicio from './views/Inicio';
import QuienesSomos from './views/QuienesSomos';
import Blog from './views/Blog';
import BlogDetalles from './views/BlogDetalles';
import Foro from './views/Foro';
import Post from './views/Post';
import Productos from './views/Productos';
import Detalles from './views/Detalles';
import Envios from './views/Envios';
import Contacto from './views/Contacto';
import Programa from './views/Programa';
import Login from './views/Login';
import Registro from './views/Registro';
import RecuperarPassword from './views/RecuperarPassword';
import Perfil from './views/Perfil';
import RegistroCompras from './views/RegistroCompras';
import Checkout from './views/Checkout';
import Confirmacion from './views/Confirmacion';
import Error404 from './views/Error404';
import Footer from './components/Footer';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <React.Fragment>
          <NavbarControl />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<Detalles />} />
            <Route path="/envios" element={<Envios />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperarpassword" element={<RecuperarPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmacion" element={<Confirmacion />} />
            <Route path="*" element={<Error404 />} />
            {/* RUTAS PROTEGIDAS */}
            <Route path="/" element={<RutaProtegida />}>
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetalles />} />
              <Route path="/foro" element={<Foro />} />
              <Route path="/post" element={<Post />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/compras" element={<RegistroCompras />} />
              <Route path="/programa" element={<Programa />} />
            </Route>
          </Routes>
          <FooterControl />
        </React.Fragment>
      </Router>
    </Provider>
  );
}

const NavbarControl = () => {
  const location = useLocation();
  const routesWithoutNavbar = ['/login', '/registro', '/recuperarpassword', '/foro', '/post'];
  const hideNavbar = routesWithoutNavbar.includes(location.pathname);

  if (hideNavbar) { // No mostrar el navbar
    return null;
  }

  return <Navbar />;
};

const FooterControl = () => {
  const location = useLocation();
  const routesWithoutFooter = ['/login', '/registro', '/recuperarpassword', '/foro', '/post'];
  const hideFooter = routesWithoutFooter.includes(location.pathname);

  if (hideFooter) { // No mostrar el footer
    return null;
  }

  return <Footer />;
};

export default App;