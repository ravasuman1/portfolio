// src/contexts/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

import axiosInstance from '@/axiosConfig';
import { useQueryClient } from 'react-query';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState([]);



  const addToCart = async (bookId, quantity) => {
    try {
      const res = await axiosInstance.post('http://localhost:8000/api/cart', { book_id: bookId, quantity });
     
   


    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const updateCartItem = async ({itemId, quantity}) => {
    try {
      const response = await axiosInstance.put(`http://localhost:8000/api/cart//api/cart`, { quantity });
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === itemId ? response.data : item))
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      await axiosInstance.delete(`http://localhost:8000/api/cart//api/cart/${itemId}`);
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  //   const clearCart = async () => {
  //     try {
  //       await axios.delete('/api/cart/clear/');
  //       setCart([]);
  //     } catch (error) {
  //       console.error('Error clearing cart:', error);
  //     }
  //   };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        removeCartItem,
        setCart
        // clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
