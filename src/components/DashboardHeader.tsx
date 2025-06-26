
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Home } from "lucide-react";

const DashboardHeader = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Dashboard ESC Chorbane
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1 hidden sm:block">
              Gestion du contenu et des données du club
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1 truncate">
              <span className="hidden sm:inline">Connecté: </span>
              <span className="font-medium">{user?.email}</span>
            </span>
            
            <div className="flex gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={goToHome}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                size="sm"
              >
                <Home size={14} />
                <span className="hidden sm:inline">Accueil</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                size="sm"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
