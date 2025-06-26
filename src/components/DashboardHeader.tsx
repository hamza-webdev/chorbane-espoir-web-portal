
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard ESC Chorbane</h1>
            <p className="text-gray-600 mt-2">Gestion du contenu et des données du club</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Connecté en tant que: <span className="font-medium">{user?.email}</span>
            </span>
            <Button
              variant="outline"
              onClick={goToHome}
              className="flex items-center gap-2"
            >
              <Home size={16} />
              Accueil
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
