
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
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestion des Compétitions
          </h2>
          <p className="text-base text-gray-600">
            Organisez les compétitions et tournois
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)} 
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-base px-6 py-2"
        >
          <Plus size={18} className="mr-2" />
          Nouvelle Compétition
        </Button>
      </div>

      {/* Grid des compétitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {competitions?.map((competition) => (
          <Card key={competition.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-600">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  <CardTitle className="text-lg lg:text-xl leading-tight line-clamp-2">
                    {competition.name}
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-600 text-white text-xs">
                        {getTypeLabel(competition.type)}
                      </Badge>
                      {!competition.active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 lg:p-6 pt-0">
              {/* Informations de la compétition */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {competition.season && (
                  <div className="flex justify-between">
                    <span className="font-medium">Saison:</span>
                    <span>{competition.season}</span>
                  </div>
                )}
                {competition.start_date && (
                  <div className="flex justify-between">
                    <span className="font-medium">Début:</span>
                    <span>{new Date(competition.start_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {competition.end_date && (
                  <div className="flex justify-between">
                    <span className="font-medium">Fin:</span>
                    <span>{new Date(competition.end_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              {competition.description && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {competition.description}
                </p>
              )}
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(competition)}
                  className="flex-1 text-sm"
                >
                  <Edit size={14} className="mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(competition.id)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                >
                  <Trash2 size={14} className="mr-2" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucune compétition */}
      {competitions?.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune compétition
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre première compétition.
          </p>
          <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="mr-2" />
            Créer une compétition
          </Button>
        </div>
      )}

      <CompetitionDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        competition={editingCompetition}
      />
    </div>
  );
};

export default CompetitionsManager;
