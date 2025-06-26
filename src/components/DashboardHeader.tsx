
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
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard ESC Chorbane</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">Gestion du contenu et des données du club</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 order-3 sm:order-1">
              Connecté: <span className="font-medium truncate max-w-[150px] sm:max-w-none">{user?.email}</span>
            </span>
            <div className="flex gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={goToHome}
                className="flex items-center gap-2 text-xs sm:text-sm px-3 py-2"
                size="sm"
              >
                <Home size={14} />
                <span className="hidden sm:inline">Accueil</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-xs sm:text-sm px-3 py-2"
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
