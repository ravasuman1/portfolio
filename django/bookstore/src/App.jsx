import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login"
import Register from "./pages/register"
import AuthProvider from "./context/AuthContext"

import { QueryClient, QueryClientProvider } from "react-query";



import MainPage from "./pages/MainPage";

import CartPage from "./pages/CartPage";

import OrderPage from "./pages/OrderPage";

const queryClient = new QueryClient()

function App() {


  return (
    <QueryClientProvider client={queryClient}>

      <Router>
      
          <AuthProvider>
            <Routes>

              <Route path='/' element={<MainPage />} />
              <Route path='/cart' element={<CartPage />} />
             
              <Route path='/order' element={<OrderPage />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Other routes */}
            </Routes>
          </AuthProvider>
     

      </Router>


    </QueryClientProvider >
  )
}

export default App
