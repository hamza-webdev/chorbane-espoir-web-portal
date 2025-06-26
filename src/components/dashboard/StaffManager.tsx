import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StaffDialog from "./StaffDialog";
import ReactionButtons from "@/components/ReactionButtons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const StaffManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-admin'] });
      toast({
        title: "Membre du staff supprimé",
        description: "Le membre du staff a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre du staff.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (member: any) => {
    setEditingStaff(member);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre du staff ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStaff(null);
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      'entraineur': 'Entraîneur',
      'entraineur_adjoint': 'Entraîneur adjoint',
      'preparateur_physique': 'Préparateur physique',
      'medecin': 'Médecin',
      'manager': 'Manager',
      'autre': 'Autre'
    };
    return roles[role] || role;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion du Staff</h2>
          <p className="text-sm sm:text-base text-gray-600">Gérez l'équipe technique et administrative</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus size={16} className="mr-2" />
          Nouveau Membre
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {staff?.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage src={member.photo} alt={member.name} />
                    <AvatarFallback>
                      <Users className="h-4 w-4 sm:h-6 sm:w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm sm:text-lg truncate">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <Badge className="bg-green-600 text-xs w-fit">
                        {getRoleLabel(member.role)}
                      </Badge>
                      {!member.active && (
                        <Badge variant="secondary" className="text-xs w-fit">Inactif</Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-4">
                {member.email && <p className="truncate">Email: {member.email}</p>}
                {member.phone && <p>Tél: {member.phone}</p>}
                {member.joined_date && (
                  <p>Arrivé le: {new Date(member.joined_date).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
              {member.bio && (
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4">
                  {member.bio}
                </p>
              )}
              
              {/* Boutons de réaction */}
              <div className="mb-4">
                <ReactionButtons 
                  entityType="staff" 
                  entityId={member.id} 
                  size="sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(member)}
                  className="text-xs sm:text-sm"
                >
                  <Edit size={12} className="mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
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

      <StaffDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        staff={editingStaff}
      />
    </div>
  );
};

export default StaffManager;
