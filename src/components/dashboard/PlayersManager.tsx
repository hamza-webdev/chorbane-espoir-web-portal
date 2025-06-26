
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PlayerDialog from "./PlayerDialog";

const PlayersManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: players, isLoading } = useQuery({
    queryKey: ['players-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('jersey_number', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players-admin'] });
      toast({
        title: "Joueur supprimé",
        description: "Le joueur a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le joueur.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (player: any) => {
    setEditingPlayer(player);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce joueur ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlayer(null);
  };

  const getPositionLabel = (position: string) => {
    const positions = {
      'gardien': 'Gardien',
      'defenseur': 'Défenseur',
      'milieu': 'Milieu',
      'attaquant': 'Attaquant'
    };
    return positions[position] || position;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Joueurs</h2>
          <p className="text-gray-600">Gérez l'effectif de l'équipe</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus size={16} className="mr-2" />
          Nouveau Joueur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players?.map((player) => (
          <Card key={player.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {player.jersey_number && (
                      <Badge className="bg-green-600">#{player.jersey_number}</Badge>
                    )}
                    {player.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {getPositionLabel(player.position)}
                    </Badge>
                    {!player.active && (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {player.age && <p>Âge: {player.age} ans</p>}
                {player.height && <p>Taille: {player.height} cm</p>}
                {player.weight && <p>Poids: {player.weight} kg</p>}
                {player.joined_date && (
                  <p>Arrivé le: {new Date(player.joined_date).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
              {player.bio && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {player.bio}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(player)}
                >
                  <Edit size={14} className="mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(player.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} className="mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlayerDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        player={editingPlayer}
      />
    </div>
  );
};

export default PlayersManager;
