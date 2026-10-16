import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header, Footer } from './components/layout/StoreLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProductsAdminPage } from './pages/admin/ProductsAdminPage';
import { OrdersAdminPage } from './pages/admin/OrdersAdminPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { CategoriesAdminPage } from './pages/admin/CategoriesAdminPage';
import { BannersAdminPage } from './pages/admin/BannersAdminPage';
import { UsersAdminPage } from './pages/admin/UsersAdminPage';
import { ImportPage } from './pages/admin/ImportPage';
import { AdminLoginPage } from './pages/admin/LoginPage';
import { DiagnosticPage } from './pages/admin/DiagnosticPage';
import { TestConnectionPage } from './pages/admin/TestConnectionPage';
import { SetupWizardPage } from './pages/admin/SetupWizardPage';
import { OffersPage, FlashSalePage, FreeGiftsPage } from './pages/SpecialPages';

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-color-7">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Storefront routes */}
          <Route path="/" element={<StoreLayout><HomePage /></StoreLayout>} />
          <Route path="/products" element={<StoreLayout><ProductsPage /></StoreLayout>} />
          <Route path="/products/:slug" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
          <Route path="/categories" element={<StoreLayout><ProductsPage /></StoreLayout>} />
          <Route path="/offers" element={<StoreLayout><OffersPage /></StoreLayout>} />
          <Route path="/flash-sale" element={<StoreLayout><FlashSalePage /></StoreLayout>} />
          <Route path="/free-gifts" element={<StoreLayout><FreeGiftsPage /></StoreLayout>} />
          <Route path="/about" element={<StoreLayout><AboutPage /></StoreLayout>} />
          <Route path="/cart" element={<StoreLayout><CartPage /></StoreLayout>} />
          <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/diagnostic" element={<DiagnosticPage />} />
          <Route path="/admin/test" element={<TestConnectionPage />} />
          <Route path="/admin/setup" element={<SetupWizardPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="banners" element={<BannersAdminPage />} />
            <Route path="users" element={<UsersAdminPage />} />
            <Route path="import" element={<ImportPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

// Simple About page
function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-color-1 mb-6">About Meili Beauty Shop</h1>
      <div className="prose prose-sm max-w-none text-color-2 space-y-4">
        <p className="text-lg">
          Welcome to Meili Beauty Shop — your trusted destination for premium beauty and skincare products. We curate the finest products from around the world to bring you authentic, high-quality beauty essentials.
        </p>
        <p>
          Founded with a passion for beauty and self-care, we believe everyone deserves access to products that make them feel confident and radiant. Our collection spans skincare, makeup, haircare, fragrances, K-Beauty, and more.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-color-8 rounded-sm shadow-md">
            <span className="text-3xl mb-3 block">🌿</span>
            <h3 className="font-semibold text-color-1 mb-1">Natural ingredients</h3>
            <p className="text-xs text-color-2">We prioritize products with natural, safe ingredients</p>
          </div>
          <div className="text-center p-6 bg-color-8 rounded-sm shadow-md">
            <span className="text-3xl mb-3 block">✅</span>
            <h3 className="font-semibold text-color-1 mb-1">100% authentic</h3>
            <p className="text-xs text-color-2">Every product is verified and sourced directly</p>
          </div>
          <div className="text-center p-6 bg-color-8 rounded-sm shadow-md">
            <span className="text-3xl mb-3 block">🚚</span>
            <h3 className="font-semibold text-color-1 mb-1">Fast delivery</h3>
            <p className="text-xs text-color-2">Quick and reliable delivery across Bangladesh</p>
          </div>
        </div>

        <div className="mt-12 bg-color-8 rounded-sm shadow-md p-6">
          <h2 className="text-xl font-bold text-color-1 mb-4">Get in touch</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-color-2">
            <div>
              <p className="font-medium text-color-1 mb-1">Phone</p>
              <p>+880 1965 480 023</p>
            </div>
            <div>
              <p className="font-medium text-color-1 mb-1">Email</p>
              <p>meilibeautybd@gmail.com</p>
            </div>
            <div>
              <p className="font-medium text-color-1 mb-1">Shop location</p>
              <p>Mohammadpur, Dhaka, Bangladesh</p>
            </div>
            <div>
              <p className="font-medium text-color-1 mb-1">Operated from</p>
              <p>Nanjing, China 🇨🇳</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
