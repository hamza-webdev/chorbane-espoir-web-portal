
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DonationFormDialog from "./DonationFormDialog";

const DonationsManager = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: donations, isLoading, refetch } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Donation supprimée",
        description: "La donation a été supprimée avec succès",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la donation",
        variant: "destructive",
      });
    }
  };

  const totalAmount = donations?.reduce((sum, donation) => {
    const amount = typeof donation.amount === 'string' 
      ? parseFloat(donation.amount) 
      : donation.amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0) || 0;

  const completedDonations = donations?.filter(d => d.status === 'completed').length || 0;
  const pendingDonations = donations?.filter(d => d.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Donations</h2>
          <p className="text-gray-600">Gérer les donations reçues par le club</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Ajouter une donation
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Collecté</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalAmount.toLocaleString('fr-FR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} DT
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Donations Confirmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedDonations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingDonations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Donations</CardTitle>
          <CardDescription>
            Toutes les donations reçues par le club
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : donations && donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation) => {
                const amount = typeof donation.amount === 'string' 
                  ? parseFloat(donation.amount) 
                  : donation.amount;
                
                return (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {donation.is_anonymous ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="font-medium">
                            {donation.donor_name || "Donateur"}
                          </span>
                        </div>
                        <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                          {donation.status === 'completed' ? 'Confirmé' : 'En attente'}
                        </Badge>
                        {donation.payment_method && (
                          <Badge variant="outline" className="text-xs">
                            {donation.payment_method.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {format(new Date(donation.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</p>
                        {donation.donor_email && (
                          <p>📧 {donation.donor_email}</p>
                        )}
                        {donation.donor_phone && (
                          <p>📞 {donation.donor_phone}</p>
                        )}
                        {donation.message && (
                          <p className="italic bg-gray-100 p-2 rounded text-xs mt-2">
                            💬 "{donation.message}"
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {(isNaN(amount) ? 0 : amount).toLocaleString('fr-FR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })} {donation.currency || 'DT'}
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la donation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette donation ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(donation.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune donation enregistrée</p>
            </div>
          )}
        </CardContent>
      </Card>

      <DonationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

export default DonationsManager;
