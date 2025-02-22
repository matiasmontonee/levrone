import { createStore } from 'redux';

// Acciones
export const agregarProductoAlCarrito = (producto) => ({
  type: 'AGREGAR_PRODUCTO_AL_CARRITO',
  payload: producto,
});

export const eliminarProductoDelCarrito = (id) => ({
  type: 'ELIMINAR_PRODUCTO_DEL_CARRITO',
  payload: id,
});

export const incrementarCantidadProducto = (id) => ({
  type: 'INCREMENTAR_CANTIDAD_PRODUCTO',
  payload: id,
});

export const decrementarCantidadProducto = (id) => ({
  type: 'DECREMENTAR_CANTIDAD_PRODUCTO',
  payload: id,
});

export const vaciarCarrito = () => ({
  type: 'VACIAR_CARRITO',
});

// Reducer
const initialState = {
  carrito: JSON.parse(localStorage.getItem('carrito')) || [],
};

const carritoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AGREGAR_PRODUCTO_AL_CARRITO':
      const productoExistenteIndex = state.carrito.findIndex(producto => producto.id === action.payload.id);
      if (productoExistenteIndex !== -1) {
        const carritoActualizado = [...state.carrito];
        carritoActualizado[productoExistenteIndex].cantidad += 1;
        carritoActualizado[productoExistenteIndex].precioTotal = parseFloat((carritoActualizado[productoExistenteIndex].precio * carritoActualizado[productoExistenteIndex].cantidad).toFixed(3));
        const precioTotalCarrito = parseFloat(carritoActualizado.reduce((total, producto) => total + producto.precioTotal, 0).toFixed(3));
        localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
        return {
          ...state,
          carrito: carritoActualizado,
          precioTotalCarrito: precioTotalCarrito,
        };
      } else {
        const nuevoProducto = { ...action.payload, cantidad: 1, precioTotal: parseFloat(action.payload.precio.toFixed(3)) };
        const nuevoCarrito = [...state.carrito, nuevoProducto];
        const precioTotalCarrito = parseFloat(nuevoCarrito.reduce((total, producto) => total + producto.precioTotal, 0).toFixed(3));
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        return {
          ...state,
          carrito: nuevoCarrito,
          precioTotalCarrito: precioTotalCarrito,
        };
      }
    case 'ELIMINAR_PRODUCTO_DEL_CARRITO':
      const carritoFiltrado = state.carrito.filter(producto => producto.id !== action.payload);
      const precioTotalCarritoEliminado = parseFloat(carritoFiltrado.reduce((total, producto) => total + producto.precioTotal, 0).toFixed(3));
      localStorage.setItem('carrito', JSON.stringify(carritoFiltrado));
      return {
        ...state,
        carrito: carritoFiltrado,
        precioTotalCarrito: precioTotalCarritoEliminado,
      };
    case 'INCREMENTAR_CANTIDAD_PRODUCTO':
      const carritoIncrementado = state.carrito.map(producto => 
        producto.id === action.payload ? { ...producto, cantidad: producto.cantidad + 1, precioTotal: parseFloat((producto.precio * (producto.cantidad + 1)).toFixed(3)) } : producto
      );
      const precioTotalCarritoIncrementado = parseFloat(carritoIncrementado.reduce((total, producto) => total + producto.precioTotal, 0).toFixed(3));
      localStorage.setItem('carrito', JSON.stringify(carritoIncrementado));
      return {
        ...state,
        carrito: carritoIncrementado,
        precioTotalCarrito: precioTotalCarritoIncrementado,
      };
    case 'DECREMENTAR_CANTIDAD_PRODUCTO':
      const productoADecrementar = state.carrito.find(producto => producto.id === action.payload);
      if (productoADecrementar.cantidad === 1) {
        const carritoFiltradoDecrementado = state.carrito.filter(producto => producto.id !== action.payload);
        const precioTotalCarritoDecrementado = parseFloat(carritoFiltradoDecrementado.reduce((total, producto) => total + producto.precioTotal, 0).toFixed(3));
        localStorage.setItem('carrito', JSON.stringify(carritoFiltradoDecrementado));
        return {
          ...state,
          carrito: carritoFiltradoDecrementado,
          precioTotalCarrito: precioTotalCarritoDecrementado,
        };
      } else {
        const carritoDecrementado = state.carrito.map(producto => 
          producto.id === action.payload ? { ...producto, cantidad: producto.cantidad - 1, precioTotal: parseFloat((producto.precio * (producto.cantidad - 1)).toFixed(3)) } : producto
        );
        const precioTotalCarritoDecrementado = parseFloat(carritoDecrementado.reduce((total, producto) => total + producto.precioTotal, 0).toFixed(3));
        localStorage.setItem('carrito', JSON.stringify(carritoDecrementado));
        return {
          ...state,
          carrito: carritoDecrementado,
          precioTotalCarrito: precioTotalCarritoDecrementado,
        };
      }
    case 'VACIAR_CARRITO':
      localStorage.removeItem('carrito');
      return {
        ...state,
        carrito: [],
        precioTotalCarrito: 0,
      };
    default:
      return state;
  }
};

// Store
const store = createStore(carritoReducer);

export default store;