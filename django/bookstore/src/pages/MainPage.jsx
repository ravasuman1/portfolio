import React, { useRef, useState } from 'react'
import MainPageLayout from '../MainPageLayout'

import { useMutation, useQuery } from 'react-query'
import axiosInstance from '@/axiosConfig'
import CategoryCarousel from './CategoryCarousel'
import BookCard from './BookCard'



const MainPage = () => {
  const [books, setBooks] = useState([]);
  const hasFetched = useRef(false); 

  const fetchBooks = async (categoryId) => {
    if (categoryId) {
      const response = await axiosInstance.get(`/book?category=${categoryId}`);
      return response; // Adjust according to your API response structure
    }
    const response = await axiosInstance.get('/book');
    return response;
  };

  const mutation = useMutation(fetchBooks, {
    onSuccess: (data) => {
 
      setBooks(data); // Set the fetched books to state
    },
    onError: (error) => {
      console.error("Error fetching books:", error);
    },
  });

  const handleCategoryClick = (categoryId) => {
    mutation.mutate(categoryId); // Trigger the mutation with the selected category ID
  };
  if (!hasFetched.current) {
    mutation.mutate(null); // Fetch all books initially
    hasFetched.current = true; // Set the ref to true after initial fetch
  }

  return (

    <MainPageLayout>
      <div>
        < CategoryCarousel handleCategoryClick={handleCategoryClick} />
      </div>
      <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {books && books.map((book) => {
          return <BookCard key={book.id} book={book} />
        })}
      </div>
    </MainPageLayout>
  )
}

export default MainPage