
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Images, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GalleryDialog from "./GalleryDialog";
import GalleryPhotosManager from "./GalleryPhotosManager";

const GalleriesManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [viewingGallery, setViewingGallery] = useState(null);
  const [photosDialogOpen, setPhotosDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: galleries, isLoading } = useQuery({
    queryKey: ['galleries-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('galleries')
        .select(`
          *,
          photos(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Supprimer d'abord toutes les photos de la galerie
      const { error: photosError } = await supabase
        .from('photos')
        .delete()
        .eq('gallery_id', id);
      
      if (photosError) throw photosError;

      // Puis supprimer la galerie
      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries-admin'] });
      toast({
        title: "Galerie supprimée",
        description: "La galerie et toutes ses photos ont été supprimées avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la galerie.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (gallery: any) => {
    setEditingGallery(gallery);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette galerie ? Toutes les photos associées seront également supprimées.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGallery(null);
  };

  const handleViewPhotos = (gallery: any) => {
    setViewingGallery(gallery);
    setPhotosDialogOpen(true);
  };

  const handleClosePhotosDialog = () => {
    setPhotosDialogOpen(false);
    setViewingGallery(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Galeries</h2>
          <p className="text-sm sm:text-base text-gray-600">Organisez vos photos en galeries thématiques</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus size={16} className="mr-2" />
          Nouvelle Galerie
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {galleries?.map((gallery) => (
          <Card key={gallery.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm sm:text-lg truncate">
                    {gallery.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Images size={14} />
                    <span className="text-xs sm:text-sm">{gallery.photos?.[0]?.count || 0} photo(s)</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {gallery.cover_image && (
              <div className="px-4">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={gallery.cover_image}
                    alt={gallery.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            
            <CardContent className="p-4 pt-0">
              <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-4">
                {gallery.event_date && (
                  <p><strong>Date de l'événement:</strong> {new Date(gallery.event_date).toLocaleDateString('fr-FR')}</p>
                )}
                <p><strong>Créée le:</strong> {new Date(gallery.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              {gallery.description && (
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4">
                  {gallery.description}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewPhotos(gallery)}
                  className="w-full text-xs sm:text-sm"
                >
                  <Eye size={12} className="mr-2" />
                  Gérer les photos
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(gallery)}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    <Edit size={12} className="mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(gallery.id)}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                  >
                    <Trash2 size={12} className="mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleries?.length === 0 && (
        <div className="text-center py-12">
          <Images size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">Aucune galerie créée</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="mr-2" />
            Créer votre première galerie
          </Button>
        </div>
      )}

      <GalleryDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        gallery={editingGallery}
      />

      <Dialog open={photosDialogOpen} onOpenChange={handleClosePhotosDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des Photos</DialogTitle>
            <DialogDescription>
              {viewingGallery?.title}
            </DialogDescription>
          </DialogHeader>
          {viewingGallery && (
            <GalleryPhotosManager
              galleryId={viewingGallery.id}
              galleryTitle={viewingGallery.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleriesManager;
