import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage"
import OrderPage from "./pages/OrderPage/OrderPage"
import AdminPage from "./pages/AdminPage/AdminPage"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout/:orderId" element={<CheckoutPage />} />
      <Route path="/orders/:id" element={<OrderPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/checkout" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

