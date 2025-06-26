
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Équipe", href: "/equipe" },
    { name: "Matchs", href: "/matchs" },
    { name: "Actualités", href: "/actualites" },
    { name: "Galeries", href: "/galeries" },
    { name: "Contact", href: "/contact" }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-600 relative">
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
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/auth">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn size={16} />
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="lg:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
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
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 py-3 px-2 border-b border-gray-100 last:border-b-0"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/auth"
                  className="mt-4 pt-4 border-t border-gray-200"
                  onClick={toggleMenu}
                >
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <LogIn size={16} />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
