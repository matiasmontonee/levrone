import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './assets/css/style.css';
import Navbar from './components/Navbar';
import Inicio from './views/Inicio';
import QuienesSomos from './views/QuienesSomos';
import Productos from './views/Productos';
import Detalles from './views/Detalles';
import Envios from './views/Envios';
import Contacto from './views/Contacto';
import Login from './views/Login';
import Registro from './views/Registro';
import RecuperarPassword from './views/RecuperarPassword';
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
          </Routes>
          <FooterControl />
        </React.Fragment>
      </Router>
    </Provider>
  );
}

const NavbarControl = () => {
  const location = useLocation();
  const routesWithoutNavbar = ['/login', '/registro', '/recuperarpassword'];
  const hideNavbar = routesWithoutNavbar.includes(location.pathname);
  // No mostrar el navbar en login y registro
  if (hideNavbar) {
    return null;
  }
  return <Navbar />;
};

const FooterControl = () => {
  const location = useLocation();
  const routesWithoutFooter = ['/login', '/registro', '/recuperarpassword'];
  const hideFooter = routesWithoutFooter.includes(location.pathname);
  // No mostrar el footer en login y registro
  if (hideFooter) {
    return null;
  }
  return <Footer />;
};

export default App;