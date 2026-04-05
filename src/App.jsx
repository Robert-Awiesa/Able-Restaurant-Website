import { useState, useEffect } from 'react';
import './index.css';

/* ── Hooks ── */
import { useLoader }     from './hooks/useLoader';
import { useSearchForm } from './hooks/useSearchForm';

/* ── Layout ── */
import Loader     from './components/Loader/Loader';
import Header     from './components/Header/Header';
import SearchForm from './components/SearchForm';
import Cart       from './components/Cart/Cart';
import Favorites  from './components/Favorites/Favorites';

/* ── Page Sections ── */
import HomeSection   from './components/sections/Home/HomeSection';
import DishesSection from './components/sections/Dishes/DishesSection';
import AboutSection  from './components/sections/About/AboutSection';
import MenuSection   from './components/sections/Menu/MenuSection';
import ReviewSection from './components/data/Review/ReviewSection';
import ContactSection from './components/sections/Contact/ContactSection';
import Footer        from './components/sections/Footer/Footer';

/* ── Admin ── */
import AdminDashboard    from './components/Admin/AdminDashboard';
import WhatsAppButton   from './components/WhatsAppButton/WhatsAppButton';

export default function App() {
  const { visible }             = useLoader(3000);
  const { isOpen, open, close }  = useSearchForm();
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#admin');

  // Simple hash-based routing for Admin
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdminView) {
    return (
      <div className="admin-wrapper">
        <AdminDashboard />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <>
      <Loader visible={visible} />
      <Header onSearchOpen={open} />
      <SearchForm isOpen={isOpen} onClose={close} />
      <Cart />
      <Favorites />

      <main>
        <HomeSection   />
        <DishesSection />
        <AboutSection  />
        <MenuSection   />
        <ReviewSection />
        <ContactSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
