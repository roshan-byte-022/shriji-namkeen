import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { InquiryCartProvider } from './context/InquiryCartContext';

// Layouts
import { CustomerLayout } from './components/customer/CustomerLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ProductListPage } from './pages/customer/ProductListPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { WholesalePage } from './pages/customer/WholesalePage';
import { AboutPage } from './pages/customer/AboutPage';
import { ContactPage } from './pages/customer/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSecurityPage } from './pages/admin/AdminSecurityPage';

export function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <InquiryCartProvider>
          <Routes>
            {/* Public Customer Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="wholesale" element={<WholesalePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Secure Admin Portal Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="security" element={<AdminSecurityPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </InquiryCartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
