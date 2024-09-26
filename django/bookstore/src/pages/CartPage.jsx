// pages/CartPage.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Adjust imports based on actual components
import MainPageLayout from '@/MainPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/axiosConfig';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const navigate=useNavigate()
    const [quantity, setQuantity] = useState({});

    const queryClient = useQueryClient()
    const handleQuantityChange = (id, value) => {
        setQuantity(prev => ({ ...prev, [id]: value }));
    };

    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.get('/cart');

            return response;
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };
    const { data: cartItems } = useQuery('cartItems', fetchCartItems);


    const updateCartItem = async ({ id, qty }) => {

        try {
            const response = await axiosInstance.put(`http://localhost:8000/api/cart/${id}`, { quantity: qty });
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    };
    const mutation = useMutation({
        mutationFn: updateCartItem,
        onSuccess: () => {

            queryClient.invalidateQueries("cartItems")

        }

    });
    const updateQuantity = (id) => {
        const qty = quantity[id];

        mutation.mutate({ id, qty })

    }


    const removeCartItem = async (id) => {
        try {
            const response = await axiosInstance.delete(`http://localhost:8000/api/cart/${id}`);
            return response.data;

        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };
    const deleteMutate = useMutation({
        mutationFn: removeCartItem,
        onSuccess: () => {

            queryClient.invalidateQueries("cartItems")

        }

    });
    const orderCartItem = async (id) => {
        try {
            const response = await axiosInstance.post(`http://localhost:8000/api/order`);
            return response.data;

        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };
    const orderMutate = useMutation({
        mutationFn: orderCartItem,
        onSuccess: () => {

            queryClient.invalidateQueries("orderItems")

        }

    });
    const handleOrder = () => {
        orderMutate.mutate()
        navigate('/order')

    }


    return (
        <MainPageLayout>

            <div className="p-4">
                <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
                {cartItems && cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {cartItems && cartItems.cart_items.map((item, index) => (
                            <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                                <img
                                    className="w-full h-48 object-cover"
                                    src={item.book?.cover_image}
                                    alt={item.book.name}
                                />

                                <CardContent className="p-4 space-y-4">
                                    <h2 className="text-xl font-bold mb-2">{item.book.title}</h2>
                                    <p className="text-gray-700 mb-2">Author: <span className="font-medium">{item.book.author}</span></p>
                                    <p className="text-gray-600">Category: <span className="font-medium">{item.book.category.name}</span></p>
                                    <div className="mt-4 flex items-center">
                                        <label htmlFor={`quantity-${item.book.title}`} className="mr-2 text-gray-700">Quantity</label>
                                        <Input
                                            id={`quantity-${item.book.title}`}
                                            type="number"
                                            min="1"
                                            value={quantity[item.id] || item.quantity}

                                            onChange={(e) => {
                                                handleQuantityChange(item.id, Number(e.target.value))



                                            }}
                                            className="w-20"
                                        />
                                    </div>
                                    <p className="text-gray-800">Price: <span className="font-medium">{item.book.price}$</span></p>
                                    <div className='flex items-center justify-between'>
                                        <Button
                                            onClick={() => updateQuantity(item.id)}
                                            variant="outline"
                                        >
                                            Update Cart
                                        </Button>
                                        <Button
                                            onClick={() => deleteMutate.mutate(item.id)}
                                            variant="destructive"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                    </div>
                )}

            </div>
            <div className='flex items-center justify-center flex-col space-y-7'>
                <h1 className='text-7xl'>Total Price :{cartItems?.total_price}</h1>
                <h1 className='text-3xl text-semibold'>Quantity:{cartItems?.total_quantity}</h1>
                <Button onClick={()=>handleOrder()}>Order</Button>
            </div>

        </MainPageLayout>
    );
}

export default CartPage;
