
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, Heart } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import AuthModal from "./AuthModal";
import DashboardModal from "./DashboardModal";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const navigation = [
    { name: t('header.home'), href: "#accueil" },
    { name: t('header.team'), href: "#equipe" },
    { name: t('header.matches'), href: "#matchs" },
    { name: t('header.news'), href: "#actualites" },
    { name: t('header.galleries'), href: "#galeries" },
    { name: t('donations.title'), href: "#donations" },
    { name: t('header.contact'), href: "#contact" }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      setDashboardModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b-4 border-green-600 relative sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">ESC</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-800">Espoir Sportif</h1>
                <p className="text-xs sm:text-sm text-green-600">de Chorbane</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  {item.href === "#donations" && <Heart size={16} className="text-red-500" />}
                  {item.name}
                </button>
              ))}
              <LanguageSelector />
              <Button variant="outline" onClick={handleDashboardClick} className="flex items-center gap-2">
                <LogIn size={16} />
                {t('common.dashboard')}
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSelector />
              <Button
                variant="ghost"
                className="p-2"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={toggleMenu}
            />
            
            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 lg:hidden">
              <nav className="px-4 py-6">
                <div className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 py-3 px-2 border-b border-gray-100 last:border-b-0 flex items-center gap-2 text-left"
                    >
                      {item.href === "#donations" && <Heart size={16} className="text-red-500" />}
                      {item.name}
                    </button>
                  ))}
                  <Button
                    onClick={() => {
                      handleDashboardClick();
                      toggleMenu();
                    }}
                    variant="outline"
                    className="w-full flex items-center gap-2 mt-4 pt-4 border-t border-gray-200"
                  >
                    <LogIn size={16} />
                    {t('common.dashboard')}
                  </Button>
                </div>
              </nav>
            </div>
          </>
        )}
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <DashboardModal open={dashboardModalOpen} onOpenChange={setDashboardModalOpen} />
    </>
  );
};

export default Header;
