import axiosInstance from '@/axiosConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';


export default function BookCard({ book }) {
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigate()

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };


  const addToCart = async ({bookId, quantity}) => {
 
    try {
      const res = await axiosInstance.post('http://localhost:8000/api/cart', { book_id: bookId, quantity });
      return res.data;


    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
    
     queryClient.invalidateQueries("cartItems")
     navigation('/cart')
    }

  });
  const handleAddToCart = (bookId) => {
    mutation.mutate({bookId,quantity});
  
  };

  return (
    <Card className="w-62 bg-white border  border-gray-200 rounded-lg shadow-md overflow-hidden" >
      <img
        className="w-full h-48 w-62  object-cover"
        src={`http://localhost:8000/${book?.cover_image}`}
        alt={book.name}
      />
      <CardContent className="p-4 space-y-4">
        <CardTitle className="text-xl font-bold mb-2">{book.title}</CardTitle>
        <p className="text-gray-700 mb-2">Author: <span className="font-medium">{book.author}</span></p>
        <p className="text-gray-700 mb-2">Author: <span className="font-medium">{book.description}</span></p>
        <p className="text-gray-600">Category: <span className="font-medium">{book.category.name}</span></p>
        <p className="text-gray-600">Price: <span className="font-medium">{book.price}$</span></p>

        <div className="mt-4 flex items-center">
          <label htmlFor={`quantity-${book.name}`} className="mr-2 text-gray-700">Quantity:</label>
          <Input
            id={`quantity-${book.name}`}
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}Z
            className="w-20"
          />
        </div>
        <Button
          onClick={() => handleAddToCart(book.id)}
          className="w-full"
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card >
  );
}