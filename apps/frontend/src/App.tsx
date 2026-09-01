import { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Spinner from "src/components/Spinner/Spinner"

const HomePage = lazy(() => import("./pages/HomePage/HomePage"))
const CheckoutPage = lazy(() => import("./pages/CheckoutPage/CheckoutPage"))
const OrderPage = lazy(() => import("./pages/OrderPage/OrderPage"))
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"))

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout/:orderId" element={<CheckoutPage />} />
        <Route path="/orders/:id" element={<OrderPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/checkout" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

