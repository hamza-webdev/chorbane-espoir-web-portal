
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CompetitionDialog from "./CompetitionDialog";

const CompetitionsManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: competitions, isLoading } = useQuery({
    queryKey: ['competitions-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('competitions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions-admin'] });
      toast({
        title: "Compétition supprimée",
        description: "La compétition a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétition.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (competition: any) => {
    setEditingCompetition(competition);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette compétition ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCompetition(null);
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'championnat': 'Championnat',
      'coupe': 'Coupe',
      'amical': 'Match amical',
      'autre': 'Autre'
    };
    return types[type] || type;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Compétitions</h2>
          <p className="text-sm sm:text-base text-gray-600">Organisez les compétitions et tournois</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus size={16} className="mr-2" />
          Nouvelle Compétition
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {competitions?.map((competition) => (
          <Card key={competition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm sm:text-lg truncate">
                    {competition.name}
                  </CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                    <Badge className="bg-green-600 text-xs w-fit">
                      {getTypeLabel(competition.type)}
                    </Badge>
                    {!competition.active && (
                      <Badge variant="secondary" className="text-xs w-fit">Inactive</Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-4">
                {competition.season && (
                  <p><strong>Saison:</strong> {competition.season}</p>
                )}
                {competition.start_date && (
                  <p><strong>Début:</strong> {new Date(competition.start_date).toLocaleDateString('fr-FR')}</p>
                )}
                {competition.end_date && (
                  <p><strong>Fin:</strong> {new Date(competition.end_date).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
              {competition.description && (
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4">
                  {competition.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(competition)}
                  className="text-xs sm:text-sm"
                >
                  <Edit size={12} className="mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(competition.id)}
                  className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                >
                  <Trash2 size={12} className="mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CompetitionDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        competition={editingCompetition}
      />
    </div>
  );
};

export default CompetitionsManager;
