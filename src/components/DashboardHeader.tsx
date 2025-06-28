
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          {/* Titre */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Dashboard ESC Chorbane
            </h1>
            <p className="text-gray-600 text-sm lg:text-base mt-1 hidden sm:block">
              Gestion du contenu et des données du club
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Utilisateur connecté */}
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              <span className="hidden sm:inline">Connecté: </span>
              <span className="font-medium text-green-700 truncate max-w-[200px] inline-block">
                {user?.email}
              </span>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={goToHome}
                className="flex items-center gap-2 text-sm px-3 py-2"
                size="sm"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Accueil</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                size="sm"
              >
                <LogOut size={16} />
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
