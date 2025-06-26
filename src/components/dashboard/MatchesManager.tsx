
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MatchDialog from "./MatchDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const MatchesManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          competitions (name, type)
        `)
        .order('match_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches-admin'] });
      queryClient.invalidateQueries({ queryKey: ['nextMatch'] });
      toast({
        title: "Match supprimé",
        description: "Le match a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le match.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (match: any) => {
    setEditingMatch(match);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMatch(null);
  };

  const getStatusLabel = (status: string) => {
    const statuses = {
      'a_venir': { label: 'À venir', variant: 'default' as const },
      'en_cours': { label: 'En cours', variant: 'secondary' as const },
      'termine': { label: 'Terminé', variant: 'outline' as const },
      'reporte': { label: 'Reporté', variant: 'destructive' as const }
    };
    return statuses[status] || { label: status, variant: 'default' as const };
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Matchs</h2>
          <p className="text-gray-600">Planifiez et gérez les matchs de l'équipe</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus size={16} className="mr-2" />
          Nouveau Match
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches?.map((match) => {
          const statusInfo = getStatusLabel(match.status);
          return (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      ESC vs {match.opponent_team}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                      {match.competitions && (
                        <Badge variant="outline">
                          {match.competitions.name}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>
                    <strong>Date:</strong> {format(new Date(match.match_date), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </p>
                  {match.venue && (
                    <p><strong>Lieu:</strong> {match.venue}</p>
                  )}
                  <p>
                    <strong>Type:</strong> {match.is_home ? 'Domicile' : 'Extérieur'}
                  </p>
                  {(match.our_score !== null || match.opponent_score !== null) && (
                    <p>
                      <strong>Score:</strong> {match.our_score ?? '-'} - {match.opponent_score ?? '-'}
                    </p>
                  )}
                </div>
                {match.notes && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    <strong>Notes:</strong> {match.notes}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(match)}
                  >
                    <Edit size={14} className="mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(match.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <MatchDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        match={editingMatch}
      />
    </div>
  );
};

export default MatchesManager;
