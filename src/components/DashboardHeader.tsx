
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Home, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate("/auth");
    }
    setIsMenuOpen(false);
  };

  const goToHome = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">ESC</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Dashboard ESC Chorbane
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 hidden sm:block truncate">
                Gestion du contenu et des données du club
              </p>
            </div>
          </div>
          
          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Utilisateur connecté */}
            <div className="text-sm text-gray-600 hidden lg:block">
              <span>Connecté: </span>
              <span className="font-medium text-green-700 max-w-[200px] truncate inline-block">
                {user?.email}
              </span>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={goToHome}
                className="flex items-center gap-2 text-sm"
                size="sm"
              >
                <Home size={16} />
                <span className="hidden lg:inline">Accueil</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                size="sm"
              >
                <LogOut size={16} />
                <span className="hidden lg:inline">Déconnexion</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 md:hidden border-t">
            <div className="px-4 py-4">
              {/* Utilisateur connecté en mobile */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="block text-xs text-gray-500 mb-1">Connecté en tant que:</span>
                  <span className="font-medium text-green-700 text-base truncate block">
                    {user?.email}
                  </span>
                </div>
              </div>
              
              {/* Actions en mobile */}
              <div className="space-y-3">
                <Button
                  onClick={goToHome}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Home size={16} />
                  Accueil
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHeader;
