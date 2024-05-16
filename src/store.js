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

export const vaciarCarrito = () => ({
  type: 'VACIAR_CARRITO',
});

// Reducer

const initialState = {
  carrito: [],
};

const carritoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AGREGAR_PRODUCTO_AL_CARRITO':
      return {
        ...state,
        carrito: [...state.carrito, action.payload],
      };
    case 'ELIMINAR_PRODUCTO_DEL_CARRITO':
      return {
        ...state,
        carrito: state.carrito.filter(producto => producto.id !== action.payload),
      };
    case 'VACIAR_CARRITO':
      return {
        ...state,
        carrito: [],
      };      
    default:
      return state;
  }
};

// Store

const store = createStore(carritoReducer);

export default store;