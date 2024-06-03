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
        carritoActualizado[productoExistenteIndex].cantidad += 1; // Aumentar cantidad en 1
        carritoActualizado[productoExistenteIndex].precioTotal = carritoActualizado[productoExistenteIndex].precio * carritoActualizado[productoExistenteIndex].cantidad; // Actualizar precio total
        const precioTotalCarrito = carritoActualizado.reduce((total, producto) => total + producto.precioTotal, 0); // Calcular precio total del carrito
        localStorage.setItem('carrito', JSON.stringify(carritoActualizado)); // Actualizar localStorage
        return {
          ...state,
          carrito: carritoActualizado,
          precioTotalCarrito: precioTotalCarrito, // Actualizar precio total del carrito en el estado
        };
      } else {
        const nuevoProducto = { ...action.payload, cantidad: 1, precioTotal: action.payload.precio }; // Inicializar cantidad en 1 y precio total
        const nuevoCarrito = [...state.carrito, nuevoProducto];
        const precioTotalCarrito = nuevoCarrito.reduce((total, producto) => total + producto.precioTotal, 0); // Calcular precio total del carrito
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Guardar en localStorage
        return {
          ...state,
          carrito: nuevoCarrito,
          precioTotalCarrito: precioTotalCarrito, // Actualizar precio total del carrito en el estado
        };
      }
    case 'ELIMINAR_PRODUCTO_DEL_CARRITO':
      const carritoFiltrado = state.carrito.filter(producto => producto.id !== action.payload);
      const precioTotalCarrito = carritoFiltrado.reduce((total, producto) => total + producto.precioTotal, 0); // Calcular precio total del carrito
      localStorage.setItem('carrito', JSON.stringify(carritoFiltrado)); // Actualizar localStorage
      return {
        ...state,
        carrito: carritoFiltrado,
        precioTotalCarrito: precioTotalCarrito, // Actualizar precio total del carrito en el estado
      };
    case 'INCREMENTAR_CANTIDAD_PRODUCTO':
      const carritoIncrementado = state.carrito.map(producto => 
        producto.id === action.payload ? { ...producto, cantidad: producto.cantidad + 1, precioTotal: producto.precio * (producto.cantidad + 1) } : producto // Actualizar precio total
      );
      const precioTotalCarritoIncrementado = carritoIncrementado.reduce((total, producto) => total + producto.precioTotal, 0); // Calcular precio total del carrito
      localStorage.setItem('carrito', JSON.stringify(carritoIncrementado));
      return {
        ...state,
        carrito: carritoIncrementado,
        precioTotalCarrito: precioTotalCarritoIncrementado, // Actualizar precio total del carrito en el estado
      };
    case 'DECREMENTAR_CANTIDAD_PRODUCTO':
      const productoADecrementar = state.carrito.find(producto => producto.id === action.payload);
      if (productoADecrementar.cantidad === 1) { // Si la cantidad es 1, eliminar el producto del carrito
        const carritoFiltrado = state.carrito.filter(producto => producto.id !== action.payload);
        const precioTotalCarritoDecrementado = carritoFiltrado.reduce((total, producto) => total + producto.precioTotal, 0); // Calcular precio total del carrito
        localStorage.setItem('carrito', JSON.stringify(carritoFiltrado));
        return {
          ...state,
          carrito: carritoFiltrado,
          precioTotalCarrito: precioTotalCarritoDecrementado, // Actualizar precio total del carrito en el estado
        };
      } else { // Si la cantidad es mayor a 1, decrementar la cantidad
        const carritoDecrementado = state.carrito.map(producto => 
          producto.id === action.payload ? { ...producto, cantidad: producto.cantidad - 1, precioTotal: producto.precio * (producto.cantidad - 1) } : producto // Actualizar precio total
        );
        const precioTotalCarritoDecrementado = carritoDecrementado.reduce((total, producto) => total + producto.precioTotal, 0); // Calcular precio total del carrito
        localStorage.setItem('carrito', JSON.stringify(carritoDecrementado));
        return {
          ...state,
          carrito: carritoDecrementado,
          precioTotalCarrito: precioTotalCarritoDecrementado, // Actualizar precio total del carrito en el estado
        };
      }
    case 'VACIAR_CARRITO':
      localStorage.removeItem('carrito'); // Limpiar localStorage
      return {
        ...state,
        carrito: [],
        precioTotalCarrito: 0, // Reiniciar precio total del carrito
      };
    default:
      return state;
  }
};

// Store
const store = createStore(carritoReducer);

export default store;
