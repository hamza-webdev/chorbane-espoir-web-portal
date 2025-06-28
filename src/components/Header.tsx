
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, Heart } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: t('header.home'), href: "#accueil" },
    { name: t('header.news'), href: "#actualites" },
    { name: t('header.team'), href: "#equipe" },
    { name: t('header.matches'), href: "#matchs" },
    { name: t('header.galleries'), href: "#galeries" },
    { name: "Soutenez le club", href: "#donations" },
    { name: t('header.contact'), href: "#contact" }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
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
    <header className="bg-white shadow-lg border-b-4 border-green-600 relative sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4 lg:py-6">
          {/* Logo et titre */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">ESC</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800 truncate">
                Espoir Sportif
              </h1>
              <p className="text-xs sm:text-sm text-green-600 hidden xs:block">
                de Chorbane
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 text-sm lg:text-base whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <Button 
                variant="outline" 
                onClick={handleDashboardClick} 
                className="flex items-center gap-2 text-sm"
                size="sm"
              >
                <LogIn size={14} />
                <span className="hidden lg:inline">{t('common.dashboard')}</span>
              </Button>
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="xl:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
            onClick={toggleMenu}
          />
          
          {/* Mobile Menu */}
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 xl:hidden border-t">
            <nav className="px-4 py-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 py-3 px-3 rounded-lg text-left text-base"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      handleDashboardClick();
                      toggleMenu();
                    }}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogIn size={16} />
                    {t('common.dashboard')}
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
