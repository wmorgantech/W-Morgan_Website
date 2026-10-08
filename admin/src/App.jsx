import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Testimonials from "./pages/Testimonials";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            localStorage.getItem("accessToken")
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/testimonials"
          element={
            <ProtectedRoute>
              <Testimonials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <Careers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;