
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    setIsMenuOpen(false);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center hover:animate-spin transition-all duration-500 cursor-pointer">
              <span className="text-white font-bold text-sm sm:text-lg">ESCH</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">
                Espoir Sportif
              </h1>
              <p className="text-xs sm:text-sm text-green-600 hidden sm:block">
                de Chorbane
              </p>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 px-2 py-2 rounded-md text-sm xl:text-base whitespace-nowrap hover:bg-green-50"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSelector />
            <Button 
              variant="outline" 
              onClick={handleDashboardClick} 
              className="flex items-center gap-2 text-sm"
              size="sm"
            >
              <LogIn size={16} />
              <span>{t('common.dashboard')}</span>
            </Button>
          </div>

          {/* Mobile Controls - Visible on mobile and tablet */}
          <div className="flex lg:hidden items-center gap-2">
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

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 lg:hidden border-t">
            <nav className="px-4 py-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full text-left text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 py-3 px-3 rounded-lg text-base"
                  >
                    {item.name}
                  </button>
                ))}
                
                {/* Dashboard Button in Mobile Menu */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Button
                    onClick={handleDashboardClick}
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
